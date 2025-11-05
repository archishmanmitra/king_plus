import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Crown, 
  UserCheck, 
  UserCog, 
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Settings,
  UserPlus,
  ArrowRightLeft,
  Search,
  Filter,
  List,
  Grid3X3,
  Plus,
  TreePine,
} from "lucide-react";
import {
  getOrgChart,
  assignEmployeeManager,
  listUsers,
  getEmployees,
  reassignTeam,
} from "@/api/employees";
import { Employee } from "@/types/employee";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

interface HierarchyNode {
  employee: Employee;
  children: HierarchyNode[];
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TeamsPageProps {}

const Teams: React.FC<TeamsPageProps> = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const urlTab = params.get('tab');
  const [activeTab, setActiveTab] = useState<'chart' | 'list'>((urlTab === 'list' ? 'list' : 'chart'));

  // Keep active tab in sync with URL changes (e.g., when navigating from sidebar)
  useEffect(() => {
    const nextTab = urlTab === 'list' ? 'list' : 'chart';
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab]);

  const changeTab = (tab: 'chart' | 'list') => {
    setActiveTab(tab);
    const next = new URLSearchParams(location.search);
    next.set('tab', tab);
    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true });
  };
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["1"])
  ); // Start with CEO expanded
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Admin functionality state
  const isAdmin = user?.role === 'global_admin' || user?.role === 'hr_manager';
  const [showReassignmentModal, setShowReassignmentModal] = useState(false);
  const [employeeToReassign, setEmployeeToReassign] = useState<Employee | null>(
    null
  );
  const [newManagerId, setNewManagerId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allUsers, setAllUsers] = useState<
    Array<{ id: string; name: string; email: string; role: string }>
  >([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [userNodeQuery, setUserNodeQuery] = useState("");
  const [selectedUserNodeIds, setSelectedUserNodeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateHierarchyModal, setShowCreateHierarchyModal] = useState(false);

  // Load org chart, users, and all employees
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [orgRes, usersRes, employeesRes] = await Promise.all([
          getOrgChart(),
          listUsers(),
          getEmployees(),
        ]);
        // Flatten org chart to list and infer manager names for UI compatibility
        const flattened: Employee[] = [];
        const walk = (node: any, managerName: string | "") => {
          const e = node;
          const official = e.official || {};
          const user = e.user || {};
          const personal = e.personal || {};
          const fullName =
            [official.firstName, official.lastName].filter(Boolean).join(" ") ||
            user.name ||
            "Unknown";
          const emp: Employee = {
            id: e.id,
            employeeId: e.employeeId,
            name: fullName,
            email: user.email || personal.personalEmail || "",
            phone: personal.phoneNumber || "",
            position: official.designation || "Employee",
            department: official.unit || "", // unit from EmployeeOfficial
            manager: managerName || "",
            managerId: e.managerId || null,
            joinDate: e.createdAt
              ? new Date(e.createdAt).toISOString()
              : new Date().toISOString(),
            status: "active",
            avatar: e.avatar || "",
            directReports: (e.directReports || []).map((dr: any) => ({
              id: dr.id,
              employeeId: dr.employeeId,
              name: [dr.official?.firstName, dr.official?.lastName].filter(Boolean).join(" ") || dr.user?.name || "",
              email: dr.user?.email || dr.personal?.personalEmail || "",
              position: dr.official?.designation || "",
              department: dr.official?.unit || "",
              avatar: dr.avatar || ""
            })),
            personalInfo: {
              firstName: personal.firstName || "",
              lastName: personal.lastName || "",
              gender: "other",
              dateOfBirth: "",
              maritalStatus: "single",
              nationality: "",
              primaryCitizenship: "",
              phoneNumber: personal.phoneNumber || "",
              email: user.email || personal.personalEmail || "",
              addresses: {
                present: {
                  contactName: "",
                  address1: "",
                  city: "",
                  state: "",
                  country: "",
                  pinCode: "",
                  mobileNumber: "",
                },
                primary: {
                  contactName: "",
                  address1: "",
                  city: "",
                  state: "",
                  country: "",
                  pinCode: "",
                  mobileNumber: "",
                },
                emergency: {
                  contactName: "",
                  relation: "",
                  phoneNumber: "",
                  address: {
                    contactName: "",
                    address1: "",
                    city: "",
                    state: "",
                    country: "",
                    pinCode: "",
                    mobileNumber: "",
                  } as any,
                } as any,
              },
              passport: {
                passportNumber: "",
                expiryDate: "",
                issuingOffice: "",
                issuingCountry: "",
                contactNumber: "",
                address: "",
              },
              identityNumbers: {
                aadharNumber: "",
                panNumber: "",
                nsr: { itpin: "", tin: "" },
              },
              dependents: [],
              education: [],
              experience: [],
            },
            officialInfo: {
              firstName: official.firstName || "",
              lastName: official.lastName || "",
              knownAs: official.knownAs || "",
              dateOfJoining: "",
              jobConfirmation: !!official.jobConfirmation,
              role: user.role || "employee",
              designation: official.designation || "",
              stream: official.stream || "",
              subStream: official.subStream || "",
              baseLocation: official.baseLocation || "",
              currentLocation: official.currentLocation || "",
              unit: official.unit || "",
              unitHead: official.unitHead || "",
              confirmationDetails: undefined,
              documents: [],
            },
            financialInfo: {
              bankAccount: {
                bankName: "",
                accountNumber: "",
                ifscCode: "",
                modifiedDate: "",
                country: "",
              },
              retiral: {
                pfTotal: 0,
                employeePF: 0,
                employerPF: 0,
                employeeESI: 0,
                employerESI: 0,
                professionalTax: 0,
                incomeTax: 0,
                netTakeHome: 0,
                costToCompany: 0,
                basicSalary: 0,
                houseRentAllowance: 0,
                specialAllowance: 0,
              },
            },
            personalInfoLegacy: {
              dateOfBirth: "",
              address: "",
              emergencyContact: "",
              bloodGroup: "",
            },
            workInfo: {
              workLocation: "",
              employmentType: "full-time",
              salary: 0,
              benefits: [],
            },
            timeline: [],
          };
          flattened.push(emp);
          (e.directReports || []).forEach((dr: any) => walk(dr, fullName));
        };
        (orgRes.org || []).forEach((top: any) => walk(top, ""));
        setEmployees(flattened);
        setAllUsers(usersRes.users || []);
        setAllEmployees(employeesRes.employees || []);
      } catch (err) {
        console.error("Failed to load org chart/users", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build hierarchy from employees - only start from admins with no managerId
  const hierarchy = useMemo(() => {
    const employeeMap = new Map<string, Employee>();
    employees.forEach((emp) => employeeMap.set(emp.id, emp));

    // Check if any employee has a managerId (indicating hierarchy exists)
    const hasAnyManagerId = employees.some(emp => emp.managerId);

    // If no hierarchy exists (no managerIds), show only the current user
    if (!hasAnyManagerId && user) {
      // Create a mock employee object for the current user
      const currentUserEmployee: Employee = {
        id: user.id,
        employeeId: user.employeeId || 'USER001',
        name: user.name || 'Current User',
        email: user.email,
        phone: '',
        position: user.position || 'Employee',
        department: user.department || 'General',
        manager: '',
        managerId: null,
        joinDate: new Date().toISOString(),
        status: 'active',
        avatar: '',
        directReports: [],
        personalInfo: {
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          gender: 'other',
          dateOfBirth: '',
          maritalStatus: 'single',
          nationality: '',
          primaryCitizenship: '',
          phoneNumber: '',
          email: user.email,
          addresses: {
            present: {
              contactName: '',
              address1: '',
              city: '',
              state: '',
              country: '',
              pinCode: '',
              mobileNumber: '',
            },
            primary: {
              contactName: '',
              address1: '',
              city: '',
              state: '',
              country: '',
              pinCode: '',
              mobileNumber: '',
            },
            emergency: {
              contactName: '',
              relation: '',
              phoneNumber: '',
              address: {
                contactName: '',
                address1: '',
                city: '',
                state: '',
                country: '',
                pinCode: '',
                mobileNumber: '',
              } as any,
            } as any,
          },
          passport: {
            passportNumber: '',
            expiryDate: '',
            issuingOffice: '',
            issuingCountry: '',
            contactNumber: '',
            address: '',
          },
          identityNumbers: {
            aadharNumber: '',
            panNumber: '',
            nsr: { itpin: '', tin: '' },
          },
          dependents: [],
          education: [],
          experience: [],
        },
        officialInfo: {
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          knownAs: '',
          dateOfJoining: '',
          jobConfirmation: true,
          role: user.role,
          designation: user.position || 'Employee',
          stream: '',
          subStream: '',
          baseLocation: '',
          currentLocation: '',
          unit: user.department || 'General',
          unitHead: '',
          confirmationDetails: undefined,
          documents: [],
        },
        financialInfo: {
          bankAccount: {
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            modifiedDate: '',
            country: '',
          },
          retiral: {
            pfTotal: 0,
            employeePF: 0,
            employerPF: 0,
            employeeESI: 0,
            employerESI: 0,
            professionalTax: 0,
            incomeTax: 0,
            netTakeHome: 0,
            costToCompany: 0,
            basicSalary: 0,
            houseRentAllowance: 0,
            specialAllowance: 0,
          },
        },
        personalInfoLegacy: {
          dateOfBirth: '',
          address: '',
          emergencyContact: '',
          bloodGroup: '',
        },
        workInfo: {
          workLocation: '',
          employmentType: 'full-time',
          salary: 0,
          benefits: [],
        },
        timeline: [],
      };

      return {
        employee: currentUserEmployee,
        children: [],
        level: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    // Find top-level admins - employees with no managerId and admin role
    const topLevelAdmins = employees.filter(
      (emp) => !emp.managerId && emp.officialInfo?.role && emp.officialInfo.role !== 'employee'
    );

    if (topLevelAdmins.length === 0) return null;

    const buildHierarchy = (
      employee: Employee,
      level: number = 0
    ): HierarchyNode => {
      // Find direct reports using managerId - employees whose managerId is this employee's id
      // Filter out any invalid employees to prevent null references
      const children = employees.filter(
        (emp) => emp && emp.managerId === employee.id
      );

      return {
        employee,
        children: children
          .filter(child => child && child.id) // Ensure child is valid
          .map((child) => buildHierarchy(child, level + 1))
          .filter(node => node !== null), // Filter out any null nodes
        level,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };

    // Build hierarchy for each top-level admin
    return {
      employee: topLevelAdmins[0], // Use first admin as root for single tree
      children: topLevelAdmins.length > 1 
        ? topLevelAdmins.slice(1)
            .filter(admin => admin && admin.id) // Ensure admin is valid
            .map(admin => buildHierarchy(admin, 1))
            .filter(node => node !== null && node.employee !== null) // Filter out null nodes
        : employees
            .filter(emp => emp && emp.managerId === topLevelAdmins[0].id) // Ensure employee is valid
            .map(child => buildHierarchy(child, 1))
            .filter(node => node !== null && node.employee !== null), // Filter out null nodes
      level: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }, [employees, user]);

  // Get unassigned employees (no managerId and role is 'employee')
  const unassignedEmployees = useMemo(() => {
    return employees.filter(
      (emp) => !emp.managerId && emp.officialInfo?.role === 'employee'
    );
  }, [employees]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate positions for tree layout with responsive sizing
  // Improved algorithm that prevents overlapping and ensures proper spacing
  const calculatePositions = (
    node: HierarchyNode | null,
    startX: number = 0,
    startY: number = 0
  ): HierarchyNode | null => {
    if (!node || !node.employee) return null;
    
    const nodeWidth = isMobile ? 200 : 300;
    const nodeHeight = isMobile ? 140 : 180;
    const levelHeight = isMobile ? 220 : 280; // Increased vertical spacing
    const siblingSpacing = isMobile ? 280 : 380; // Increased horizontal spacing between siblings
    const minSubtreeWidth = nodeWidth + siblingSpacing; // Minimum width for a subtree

    // First pass: Calculate the width each subtree needs
    const calculateSubtreeWidth = (n: HierarchyNode | null): number => {
      if (!n || !n.employee) return nodeWidth;
      if (n.children.length === 0 || !expandedNodes.has(n.employee.id)) {
        return nodeWidth;
      }

      // Calculate total width needed for all children's subtrees
      let totalChildrenWidth = 0;
      n.children.filter(child => child && child.employee).forEach((child) => {
        totalChildrenWidth += calculateSubtreeWidth(child);
      });

      // Add spacing between children
      const validChildrenCount = n.children.filter(child => child && child.employee).length;
      const childrenSpacing = (validChildrenCount - 1) * siblingSpacing;
      const totalWidth = Math.max(totalChildrenWidth + childrenSpacing, minSubtreeWidth);

      return totalWidth;
    };

    // Second pass: Position nodes based on calculated widths
    const processNode = (
      n: HierarchyNode | null,
      x: number,
      y: number
    ): HierarchyNode | null => {
      if (!n || !n.employee) return null;
      
      n.x = x;
      n.y = y;
      n.width = nodeWidth;
      n.height = nodeHeight;

      const validChildren = n.children.filter(child => child && child.employee);
      if (validChildren.length > 0 && expandedNodes.has(n.employee.id)) {
        const childY = y + levelHeight;
        
        // Calculate widths for all children's subtrees
        const childWidths = validChildren.map((child) => calculateSubtreeWidth(child));
        const totalChildrenWidth = childWidths.reduce((sum, width) => sum + width, 0);
        const childrenSpacing = (validChildren.length - 1) * siblingSpacing;
        const totalWidth = totalChildrenWidth + childrenSpacing;

        // Start positioning from the left side of the parent
        // Center the children's subtree under the parent
        const parentCenterX = x + nodeWidth / 2;
        const subtreeStartX = parentCenterX - totalWidth / 2;

        let currentX = subtreeStartX;
        validChildren.forEach((child, index) => {
          if (!child || !child.employee) return;
          const childSubtreeWidth = childWidths[index];
          // Center the child node within its subtree
          const childX = currentX + childSubtreeWidth / 2 - nodeWidth / 2;
          
          processNode(child, childX, childY);
          
          // Move to next child position
          currentX += childSubtreeWidth + siblingSpacing;
        });
      }

      return n;
    };

    return processNode(node, startX, startY);
  };

  const positionedHierarchy = useMemo(() => {
    if (!hierarchy || !hierarchy.employee) return null;
    // Calculate a better starting position based on tree structure
    // Start from a central position that allows expansion in both directions
    const centerX = isMobile ? 400 : 1200; // Increased center position for better layout
    const positioned = calculatePositions(hierarchy, centerX, 80); // Increased top margin
    return positioned && positioned.employee ? positioned : null;
  }, [hierarchy, expandedNodes, isMobile]);

  const toggleNode = (employeeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Zoom and pan controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Auto-center function to center the chart when it loads
  const autoCenterChart = () => {
    if (positionedHierarchy && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Calculate the bounds of the hierarchy
      const bounds = calculateHierarchyBounds(positionedHierarchy);
      const chartWidth = bounds.maxX - bounds.minX;
      const chartHeight = bounds.maxY - bounds.minY;
      
      // Center the chart in the container
      const centerX = (containerWidth - chartWidth) / 2 - bounds.minX;
      const centerY = (containerHeight - chartHeight) / 2 - bounds.minY;
      
      setPan({ x: centerX, y: centerY });
    }
  };

  // Calculate bounds of the hierarchy
  const calculateHierarchyBounds = (
    node: HierarchyNode | null
  ): { minX: number; maxX: number; minY: number; maxY: number } => {
    if (!node || !node.employee) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    let minX = node.x;
    let maxX = node.x + node.width;
    let minY = node.y;
    let maxY = node.y + node.height;

    const validChildren = node.children.filter(child => child && child.employee);
    if (validChildren.length > 0 && expandedNodes.has(node.employee.id)) {
      validChildren.forEach((child) => {
        const childBounds = calculateHierarchyBounds(child);
        minX = Math.min(minX, childBounds.minX);
        maxX = Math.max(maxX, childBounds.maxX);
        minY = Math.min(minY, childBounds.minY);
        maxY = Math.max(maxY, childBounds.maxY);
      });
    }

    return { minX, maxX, minY, maxY };
  };

  // Auto-center when hierarchy changes
  useEffect(() => {
    if (positionedHierarchy) {
      // Small delay to ensure DOM is updated
      setTimeout(autoCenterChart, 100);
    }
  }, [positionedHierarchy]);

  // Mouse/touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Admin functions
  const handleReassignEmployee = (employee: Employee) => {
    setEmployeeToReassign(employee);
    setNewManagerId("");
    setSelectedUserNodeIds([]);
    setShowReassignmentModal(true);
  };

  const confirmReassignment = async () => {
    if (!employeeToReassign) return;
    try {
      // Step 1: If a new manager is selected, assign the employee to that manager
      if (newManagerId) {
        await reassignTeam(newManagerId, [employeeToReassign.id]);
      } else if (!newManagerId && !selectedUserNodeIds.length) {
        // No manager selected and no user nodes - set employee to top level (no manager)
        await reassignTeam(null, [employeeToReassign.id]);
      }
      
      // Step 2: If user nodes are selected, assign them as direct reports to the employeeToReassign
      if (selectedUserNodeIds.length > 0) {
        await reassignTeam(employeeToReassign.id, selectedUserNodeIds);
      }
      
      // Reload org chart to reflect all changes
      const orgRes = await getOrgChart();
      const flattened: Employee[] = [];
      const walk = (node: any, managerName: string | "") => {
        const e = node;
        const official = e.official || {};
        const user = e.user || {};
        const personal = e.personal || {};
        const fullName =
          [official.firstName, official.lastName].filter(Boolean).join(" ") ||
          user.name ||
          "Unknown";
        const emp: Employee = {
          id: e.id,
          employeeId: e.employeeId,
          name: fullName,
          email: user.email || personal.personalEmail || "",
          phone: personal.phoneNumber || "",
          position: official.designation || "Employee",
          department: official.unit || "", // unit from EmployeeOfficial
          manager: managerName || "",
          managerId: e.managerId || null,
          joinDate: e.createdAt
            ? new Date(e.createdAt).toISOString()
            : new Date().toISOString(),
          status: "active",
          avatar: e.avatar || "",
          directReports: (e.directReports || []).map((dr: any) => ({
            id: dr.id,
            employeeId: dr.employeeId,
            name: [dr.official?.firstName, dr.official?.lastName].filter(Boolean).join(" ") || dr.user?.name || "",
            email: dr.user?.email || dr.personal?.personalEmail || "",
            position: dr.official?.designation || "",
            department: dr.official?.unit || "",
            avatar: dr.avatar || ""
          })),
          personalInfo: {
            firstName: personal.firstName || "",
            lastName: personal.lastName || "",
            gender: "other",
            dateOfBirth: "",
            maritalStatus: "single",
            nationality: "",
            primaryCitizenship: "",
            phoneNumber: personal.phoneNumber || "",
            email: user.email || personal.personalEmail || "",
            addresses: {
              present: {
                contactName: "",
                address1: "",
                city: "",
                state: "",
                country: "",
                pinCode: "",
                mobileNumber: "",
              },
              primary: {
                contactName: "",
                address1: "",
                city: "",
                state: "",
                country: "",
                pinCode: "",
                mobileNumber: "",
              },
              emergency: {
                contactName: "",
                relation: "",
                phoneNumber: "",
                address: {
                  contactName: "",
                  address1: "",
                  city: "",
                  state: "",
                  country: "",
                  pinCode: "",
                  mobileNumber: "",
                } as any,
              } as any,
            },
            passport: {
              passportNumber: "",
              expiryDate: "",
              issuingOffice: "",
              issuingCountry: "",
              contactNumber: "",
              address: "",
            },
            identityNumbers: {
              aadharNumber: "",
              panNumber: "",
              nsr: { itpin: "", tin: "" },
            },
            dependents: [],
            education: [],
            experience: [],
          },
          officialInfo: {
            firstName: official.firstName || "",
            lastName: official.lastName || "",
            knownAs: official.knownAs || "",
            dateOfJoining: "",
            jobConfirmation: !!official.jobConfirmation,
            role: user.role || "employee",
            designation: official.designation || "",
            stream: official.stream || "",
            subStream: official.subStream || "",
            baseLocation: official.baseLocation || "",
            currentLocation: official.currentLocation || "",
            unit: official.unit || "",
            unitHead: official.unitHead || "",
            confirmationDetails: undefined,
            documents: [],
          },
          financialInfo: {
            bankAccount: {
              bankName: "",
              accountNumber: "",
              ifscCode: "",
              modifiedDate: "",
              country: "",
            },
            retiral: {
              pfTotal: 0,
              employeePF: 0,
              employerPF: 0,
              employeeESI: 0,
              employerESI: 0,
              professionalTax: 0,
              incomeTax: 0,
              netTakeHome: 0,
              costToCompany: 0,
              basicSalary: 0,
              houseRentAllowance: 0,
              specialAllowance: 0,
            },
          },
          personalInfoLegacy: {
            dateOfBirth: "",
            address: "",
            emergencyContact: "",
            bloodGroup: "",
          },
          workInfo: {
            workLocation: "",
            employmentType: "full-time",
            salary: 0,
            benefits: [],
          },
          timeline: [],
        };
        flattened.push(emp);
        (e.directReports || []).forEach((dr: any) => walk(dr, fullName));
      };
      (orgRes.org || []).forEach((top: any) => walk(top, ""));
      setEmployees(flattened);
    } catch (err) {
      console.error("Failed to reassign manager", err);
    } finally {
      setShowReassignmentModal(false);
      setEmployeeToReassign(null);
      setNewManagerId("");
      setSelectedUserNodeIds([]);
    }
  };

  const getAvailableManagers = () => {
    if (!employeeToReassign) return [];
    
    // Return all employees except the one being reassigned and their current direct reports
    // Choose from all users as potential managers; exclude self
    return employees.filter((emp) => emp.id !== employeeToReassign.id);
  };

  const getRoleIcon = (position: string) => {
    if (
      position.toLowerCase().includes("ceo") ||
      position.toLowerCase().includes("chief executive")
    ) {
      return <Crown className="h-4 w-4 text-yellow-500" />;
    } else if (
      position.toLowerCase().includes("hr") ||
      position.toLowerCase().includes("human resources")
    ) {
      return <UserCheck className="h-4 w-4 text-blue-500" />;
    } else if (
      position.toLowerCase().includes("manager") ||
      position.toLowerCase().includes("director")
    ) {
      return <UserCog className="h-4 w-4 text-green-500" />;
    }
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const getRoleColor = (position: string) => {
    if (
      position.toLowerCase().includes("ceo") ||
      position.toLowerCase().includes("chief executive")
    ) {
      return "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-900 border-yellow-600 shadow-md font-semibold";
    } else if (
      position.toLowerCase().includes("hr") ||
      position.toLowerCase().includes("human resources")
    ) {
      return "bg-blue-200 text-white border-blue-500 border-2 shadow-md font-semibold";
    } else if (
      position.toLowerCase().includes("manager") ||
      position.toLowerCase().includes("director")
    ) {
      return "bg-blue-200 text-white border-blue-500 border-2 shadow-md font-semibold";
    }
    return "bg-blue-200 text-white border-blue-500 border-2 shadow-md font-semibold";
  };

  const isCEO = (position: string) => {
    return (
      position.toLowerCase().includes("ceo") ||
      position.toLowerCase().includes("chief executive")
    );
  };

  const isHR = (position: string) => {
    return (
      position.toLowerCase().includes("hr") ||
      position.toLowerCase().includes("human resources")
    );
  };

  // Filter employees for list view
  const filteredEmployees = allEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(
    new Set(allEmployees.map((emp) => emp.department).filter(Boolean))
  );

  const renderNode = (node: HierarchyNode | null) => {
    if (!node || !node.employee) return null;
    
    const isExpanded = expandedNodes.has(node.employee.id);
    const hasChildren = node.children.length > 0;
    const isCurrentUserOnlyNode = node.children.length === 0 && node.employee.id === user?.id;
    const isCEOPosition = isCEO(node.employee.position);

    return (
      <div key={node.employee.id} className="relative">
        {/* Golden Ring for CEO */}
        {isCEOPosition && (
          <div
            className="absolute rounded-lg border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.7)]"
            style={{
              left: node.x - 8,
              top: node.y - 8,
              width: node.width + 16,
              height: node.height + 16,
              zIndex: 9,
              pointerEvents: "none",
            }}
          />
        )}
        {/* Node Card with Flowchart Styling */}
        <div
          className={`absolute bg-white rounded-lg shadow-lg border-2 hover:shadow-xl transition-all duration-200 cursor-pointer ${
            selectedEmployee?.id === node.employee.id 
              ? "border-blue-500 shadow-blue-200"
              : isCurrentUserOnlyNode
              ? "border-amber-300 bg-amber-50"
              : isCEOPosition
              ? "border-yellow-500"
              : "border-gray-200"
          }`}
          style={{
            left: node.x,
            top: node.y,
            width: node.width,
            height: node.height,
            zIndex: 10, // Ensure nodes are above connection lines
            // Flowchart-style enhancements
            boxShadow:
              selectedEmployee?.id === node.employee.id
                ? "0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)"
                : isCEOPosition
                ? "0 8px 25px rgba(234, 179, 8, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)",
          }}
          onClick={() => setSelectedEmployee(node.employee)}
        >
          <div className={`${isMobile ? "p-2" : "p-4"} h-full flex flex-col`}>
            {/* Flowchart-style flow indicator */}
            {hasChildren && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-500"></div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getRoleIcon(node.employee.position)}
                <span
                  className={`font-semibold ${
                    isMobile ? "text-xs" : "text-sm"
                  } truncate`}
                >
                  {node.employee.name}
                </span>
                {node.employee.position.toLowerCase().includes("ceo") && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
                {isCurrentUserOnlyNode && (
                  <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                    Current User
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.employee.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                )}
                {isAdmin &&
                  !node.employee.position.toLowerCase().includes("ceo") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReassignEmployee(node.employee);
                    }}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                    title="Reassign Employee"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Avatar and Info */}
            <div
              className={`flex items-center ${
                isMobile ? "space-x-2" : "space-x-3"
              } mb-2`}
            >
              <Avatar className={isMobile ? "h-8 w-8" : "h-10 w-10"}>
                <AvatarImage src={node.employee.avatar} />
                <AvatarFallback className={isMobile ? "text-xs" : "text-sm"}>
                  {node.employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Badge
                  className={`${
                    isMobile ? "text-xs px-1 py-0" : "text-xs"
                  } ${getRoleColor(node.employee.position)}`}
                >
                  {isMobile
                    ? node.employee.position.split(" ")[0]
                    : node.employee.position}
                </Badge>
                <p
                  className={`${
                    isMobile ? "text-xs" : "text-xs"
                  } ${isHR(node.employee.position) ? "text-white" : "text-gray-600"} mt-1 truncate`}
                >
                  {node.employee.department}
                </p>
              </div>
            </div>

            {/* Contact Info - Always show inside card */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                <span className="truncate">{node.employee.email}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Phone className="h-3 w-3" />
                <span>{node.employee.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Connection Lines with better flowchart structure */}
        {isExpanded && hasChildren && (
          <svg
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            {node.children.map((child, index) => {
              const startX = node.x + node.width / 2;
              const startY = node.y + node.height;
              const endX = child.x + child.width / 2;
              const endY = child.y;

              // Create more sophisticated curved lines for flowchart structure
              const deltaY = endY - startY;
              const deltaX = endX - startX;
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              
              // Control points for smooth curves - improved for better visual flow
              const controlPoint1X = startX;
              const controlPoint1Y = startY + deltaY * 0.4;
              const controlPoint2X = endX;
              const controlPoint2Y = endY - deltaY * 0.4;

              // Create gradient for the line
              const gradientId = `gradient-${node.employee.id}-${index}`;
              const shadowGradientId = `shadow-${node.employee.id}-${index}`;

              return (
                <g key={index}>
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                      <stop
                        offset="50%"
                        stopColor="#8b5cf6"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                    <linearGradient
                      id={shadowGradientId}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
                      <stop
                        offset="50%"
                        stopColor="#7c3aed"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="#0891b2"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                  </defs>
                  
                  {/* Main curved path with dashed line */}
                  <path
                    d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endX} ${endY}`}
                    stroke="#3b82f6"
                    strokeWidth={isMobile ? "3" : "4"}
                    strokeDasharray={isMobile ? "6,3" : "10,5"}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Arrow head with solid fill for better visibility */}
                  <path
                    d={`M ${endX - 10} ${endY - 10} L ${endX} ${endY} L ${
                      endX - 10
                    } ${endY + 10}`}
                    stroke="none"
                    fill="#3b82f6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Enhanced shadow effect with dashed pattern */}
                  <path
                    d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endX} ${endY}`}
                    stroke={`url(#${shadowGradientId})`}
                    strokeWidth={isMobile ? "6" : "7"}
                    strokeDasharray={isMobile ? "6,3" : "10,5"}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                    filter="blur(2px)"
                  />
                  
                  {/* Connection flow indicator dots */}
                  <circle
                    cx={startX + (endX - startX) * 0.25}
                    cy={startY + (endY - startY) * 0.25}
                    r="3"
                    fill="#3b82f6"
                    opacity="0.9"
                  />
                  <circle
                    cx={startX + (endX - startX) * 0.75}
                    cy={startY + (endY - startY) * 0.75}
                    r="3"
                    fill="#3b82f6"
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Render Children */}
        {isExpanded && hasChildren && (
          <div>{node.children.filter(child => child && child.employee).map((child) => renderNode(child))}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading team data...</p>
        </div>
      </div>
    );
  }

  // If no hierarchy exists and no user data, show a message
  if (!positionedHierarchy && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No organizational chart available</p>
          <p className="text-sm text-gray-400 mt-2">Please log in to view the organizational structure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Team Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            {viewMode === "chart"
              ? "Organizational structure and reporting relationships"
              : "Employee directory and management"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Users className="h-4 w-4 mr-2" />
            {allEmployees.length} Total Employees
          </Badge>
          {isAdmin && positionedHierarchy && positionedHierarchy.children.length === 0 && (
            <Button 
              onClick={() => setShowCreateHierarchyModal(true)}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Members
            </Button>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === "chart" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setViewMode("chart"); changeTab('chart'); }}
            className="h-8 px-3"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Chart View
          </Button>
          <Button
            variant={activeTab === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setViewMode("list"); changeTab('list'); }}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      {activeTab === "list" ? (
        /* Employee List View */
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading employees...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
          {/* Search and Filter Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Employee Directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search employees by name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select
                    value={filterDepartment}
                    onValueChange={setFilterDepartment}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback className="text-xs">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">
                              {employee.employeeId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(employee.position)}
                          <span className="text-sm">{employee.position}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {employee.department || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {employee.manager || "No manager"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-32">
                              {employee.email}
                            </span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{employee.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize text-xs"
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReassignEmployee(employee)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                            title="Reassign Employee"
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No employees found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </div>
      ) : (
        /* Chart View */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Tree Visualization */}
          <div className="xl:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Organizational Chart</span>
                </CardTitle>
                
                {/* Zoom and Pan Controls */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      className="h-8 w-8 p-0"
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium px-2">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      className="h-8 w-8 p-0"
                      disabled={zoom >= 2}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={autoCenterChart}
                      className="h-8 w-8 p-0"
                      title="Fit to Screen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={containerRef}
                className="relative overflow-auto bg-gray-50 rounded-lg"
                style={{ 
                    minHeight: isMobile ? "500px" : "800px",
                    height: isMobile ? "500px" : "800px",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="relative transition-transform duration-200 ease-out"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: "top left",
                      width: isMobile ? "2000px" : "3000px", // Significantly increased canvas width for left/right expansion
                      height: isMobile ? "1200px" : "2000px", // Increased canvas height for deeper trees
                      cursor: isDragging ? "grabbing" : "grab",
                  }}
                >
                  {positionedHierarchy && positionedHierarchy.employee && renderNode(positionedHierarchy)}
                </div>
                
                {/* Instructions overlay for mobile */}
                {isMobile && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <p className="text-xs text-gray-600">
                      Drag to pan • Pinch to zoom • Tap nodes to expand
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Details Sidebar */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmployee ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={selectedEmployee.avatar} />
                      <AvatarFallback className="text-lg">
                          {selectedEmployee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </AvatarFallback>
                    </Avatar>
                      <h3 className="font-semibold text-lg">
                        {selectedEmployee.name}
                      </h3>
                      <Badge
                        className={`mt-2 ${getRoleColor(
                          selectedEmployee.position
                        )}`}
                      >
                      {selectedEmployee.position}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-500">
                          Department
                        </label>
                      <p className="text-sm">{selectedEmployee.department}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">
                          Manager
                        </label>
                      <p className="text-sm">{selectedEmployee.manager}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">
                          Employee ID
                        </label>
                        <p className="text-sm font-mono">
                          {selectedEmployee.employeeId}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">
                          Join Date
                        </label>
                      <p className="text-sm">
                          {new Date(
                            selectedEmployee.joinDate
                          ).toLocaleDateString()}
                      </p>
                    </div>

                      {/* <div>
                        <label className="text-sm font-medium text-gray-500">
                          Status
                        </label>
                      <Badge 
                          variant={
                            selectedEmployee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        className="capitalize"
                      >
                        {selectedEmployee.status}
                      </Badge>
                      </div> */}

                    <div className="pt-3 border-t">
                        <label className="text-sm font-medium text-gray-500">
                          Contact
                        </label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">
                              {selectedEmployee.email}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedEmployee.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Select an employee to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Not Selected Employees Section */}
          {unassignedEmployees.length > 0 && viewMode === 'chart' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm xl:text-base">Not Selected Employees ({unassignedEmployees.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {unassignedEmployees.map((emp) => (
                    <Card 
                      key={emp.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <CardContent className="p-3 xl:p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={emp.avatar} />
                            <AvatarFallback>
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{emp.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{emp.position}</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{emp.email}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReassignEmployee(emp);
                            }}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Assign Manager
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      )}

      {/* Reassignment Modal */}
      <Dialog
        open={showReassignmentModal}
        onOpenChange={setShowReassignmentModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ArrowRightLeft className="h-5 w-5" />
              <span>Reassign Employee</span>
            </DialogTitle>
            <DialogDescription>
              Change the manager assignment for {employeeToReassign?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Current Manager
              </label>
              <p className="text-sm text-gray-600">
                {employeeToReassign?.manager || "No manager assigned"}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                New Manager
              </label>
              <Select value={newManagerId} onValueChange={setNewManagerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a new manager" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableManagers().map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={manager.avatar} />
                          <AvatarFallback className="text-xs">
                            {manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{manager.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {manager.position}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                User Nodes
              </label>
              {/* Selected chips */}
              {selectedUserNodeIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUserNodeIds.map((id) => {
                    const emp = allEmployees.find((e) => e.id === id);
                    return (
                      <Badge 
                        key={id} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedUserNodeIds((prev) => prev.filter((x) => x !== id));
                        }}
                      >
                        {emp?.name || id} ×
                      </Badge>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 border rounded-md">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search employees..."
                    value={userNodeQuery}
                    onValueChange={setUserNodeQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No employees found.</CommandEmpty>
                    <CommandGroup heading="Employees">
                      {allEmployees
                        .filter(
                          (e) =>
                            !userNodeQuery ||
                            e.name
                              ?.toLowerCase()
                              .includes(userNodeQuery.toLowerCase()) ||
                            e.email
                              ?.toLowerCase()
                              .includes(userNodeQuery.toLowerCase())
                        )
                        .slice(0, 50)
                        .map((e) => {
                          const checked = selectedUserNodeIds.includes(e.id);
                          return (
                            <CommandItem
                              key={e.id}
                              value={e.id}
                              onSelect={() => {
                                setSelectedUserNodeIds((prev) =>
                                  prev.includes(e.id)
                                    ? prev.filter((x) => x !== e.id)
                                    : [...prev, e.id]
                                );
                              }}
                            >
                              <div 
                                className="flex items-center gap-2 w-full cursor-pointer"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedUserNodeIds((prev) =>
                                    prev.includes(e.id)
                                      ? prev.filter((x) => x !== e.id)
                                      : [...prev, e.id]
                                  );
                                }}
                              >
                                <Checkbox
                                  checked={checked}
                                  onClick={(event) => event.stopPropagation()}
                                  onCheckedChange={(checked) => {
                                    setSelectedUserNodeIds((prev) =>
                                      checked
                                        ? [...prev, e.id]
                                        : prev.filter((x) => x !== e.id)
                                    );
                                  }}
                                />
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={e.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {e.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm">{e.name}</div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {e.email}
                                  </div>
                                </div>
                                {e.position && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    {e.position}
                                  </Badge>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReassignmentModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReassignment}>
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Hierarchy Modal */}
      <Dialog
        open={showCreateHierarchyModal}
        onOpenChange={setShowCreateHierarchyModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TreePine className="h-5 w-5" />
              <span>Add Team Members</span>
            </DialogTitle>
            <DialogDescription>
              Add employees to your organizational structure and assign reporting relationships.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Build Your Team
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                To expand your organizational chart, you can:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Add new employees to the system</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Assign them as your direct reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Set up department structures</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateHierarchyModal(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowCreateHierarchyModal(false);
                // Navigate to employees page or open add employee modal
                window.location.href = '/employees';
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;
