import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Users,
  Clock,
  DollarSign,
  Target,
  FolderOpen,
  Home,
  UserCheck,
  Calendar,
  FileText,
  TrendingUp,
  Settings,
  Building2,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: [
      "global_admin",
      "hr_manager",
      "manager",
      "hr_executive",
      "employee",
    ],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    roles: ["global_admin", "hr_manager", "hr_executive"],
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: UserCheck,
    roles: [
      "global_admin",
      "hr_manager",
      "hr_executive",
      "manager",
      "employee",
    ],
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: Clock,
    roles: [
      "global_admin",
      "hr_manager",
      "hr_executive",
      "employee",
      "manager",
    ],
  },
  {
    title: "Leave Management",
    url: "/leave",
    icon: Calendar,
    roles: [
      "global_admin",
      "hr_manager",
      "hr_executive",
      "employee",
      "manager",
    ],
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: DollarSign,
    roles: ["global_admin", "hr_manager"],
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: FileText,
    roles: ["global_admin", "hr_manager", "manager", "employee"],
  },
  {
    title: "Performance",
    url: "/performance",
    icon: Target,
    roles: [
      "global_admin",
      "hr_manager",
      "performance_admin",
      "employee",
      "manager",
    ],
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
    roles: ["global_admin", "project_admin", "manager", "employee"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: TrendingUp,
    roles: ["global_admin", "hr_manager", "manager"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["global_admin", "hr_manager"],
  },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const handleCloseMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo/Brand with Mobile Close Button */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-utech flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-extrabold">
                 <img src="/kinglogo.svg" height={40} width={40} className=' rounded-full invert '/>
              </span>
            </div>
              {!isCollapsed && (
                <div>
                  <h1 className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 bg-clip-text text-transparent text-bold">
                    KIN-G +
                  </h1>
                  {/* <p className="text-xs text-sidebar-foreground/70">
                    Office Portal
                  </p> */}
                </div>
              )}
            </div>
            {/* Mobile Close Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseMobile}
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      onClick={handleCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user.position}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
