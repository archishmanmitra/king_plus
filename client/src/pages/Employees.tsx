import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployees, listUsers } from "@/api/employees";
import { useNavigate } from "react-router-dom";
import AddEmployeeModal from "@/components/modals/AddEmployeeModal";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  UserPlus,
  Building2,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listUsers();
        setEmployees(response.users || []);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employees. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  const departments = [
    "all",
    "IT",
    "Human Resources",
    "Finance",
    "Engineering",
    "Marketing",
  ];
  const statuses = ["all", "active", "inactive", "terminated"];

  const filteredEmployees = (employees || []).filter((employee) => {
    if (!employee) return false;

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      employee.personalInfo?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.officialInfo?.unit === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" ||
      (employee.user?.role ? "active" : "inactive") === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">Active</Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const viewEmployeeProfile = (userId: string) => {
    // Navigate to profile page with user ID
    navigate(`/profile/${userId}`);
  };

  const handleAddEmployee = (newEmployee: any) => {
    // Refresh the employee list after adding a new employee
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.employees || []);
      } catch (err) {
        console.error("Failed to refresh employees:", err);
      }
    };

    fetchEmployees();
    setIsAddEmployeeModalOpen(false);
    toast({
      title: "Success",
      description: `Employee has been added successfully!`,
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-lightblue">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Employee Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage your organization's workforce
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading employees...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-lightblue">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Employee Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage your organization's workforce
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-lightblue">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Employee Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="w-full sm:w-auto text-sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="w-full sm:w-auto text-sm text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {employees.length}
            </div>
            <p className="text-xs text-muted-foreground">Total workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Active
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-success">
              {employees.filter((e) => e.user?.role).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Departments
            </CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {
                new Set(
                  employees.map((e) => e.officialInfo?.unit).filter(Boolean)
                ).size
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Different departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              New Hires
            </CardTitle>
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {
                employees.filter((e) => {
                  const joinDate = e.officialInfo?.dateOfJoining;
                  if (!joinDate) return false;
                  const joinMonth = new Date(joinDate).getMonth();
                  const currentMonth = new Date().getMonth();
                  return joinMonth === currentMonth;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <Filter className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all"
                        ? "All Statuses"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Tabs defaultValue="grid" className="space-y-3 md:space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
          <TabsTrigger value="grid" className="text-sm">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="text-sm">
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarImage
                          src={employee.avatar}
                          alt={employee.name}
                        />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {employee.name || "Unknown Employee"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {employee.officialInfo?.designation || "Employee"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.employeeId}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end sm:justify-start">
                      {getStatusBadge(
                        employee.user?.role ? "active" : "inactive"
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground truncate">
                      {employee.officialInfo?.unit || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground truncate">
                      {employee.personalInfo?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {employee.personalInfo?.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => viewEmployeeProfile(employee.id)}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    {/* <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Edit
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Employee</TableHead>
                    <TableHead className="min-w-[100px]">ID</TableHead>
                    <TableHead className="min-w-[120px]">Department</TableHead>
                    <TableHead className="min-w-[150px]">Position</TableHead>
                    <TableHead className="min-w-[100px]">Join Date</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={employee.avatar}
                              alt={employee.name}
                            />
                            <AvatarFallback className="text-xs">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {employee.name || "Unknown Employee"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {employee.personalInfo?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employee.officialInfo?.unit || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employee.officialInfo?.designation || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employee.officialInfo?.dateOfJoining
                          ? new Date(
                              employee.officialInfo.dateOfJoining
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          employee.user?.role ? "active" : "inactive"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              viewEmployeeProfile(employee.user?.id)
                            }
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onSave={handleAddEmployee}
      />
    </div>
  );
};

export default Employees;
