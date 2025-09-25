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
      "employee",
    ],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    roles: ["global_admin", "hr_manager"],
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: UserCheck,
    roles: [
      "global_admin",
      "hr_manager",
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
      "employee",
      "manager",
    ],
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
    roles: ["global_admin", "manager", "employee"],
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
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} bg-transparent border-none shadow-none text-sidebar-foreground`} collapsible="icon">
      <SidebarContent className="scrollbar-premium">
        {/* Logo/Brand with Mobile Close Button */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <span className=" font-extrabold">
                  <img src="/kinglogo.svg" height={50} width={50} className='rounded-lg'/>
                </span>
              {!isCollapsed && (
                <div>
                  <h1 className="text-foreground font-bold text-lg tracking-tight">
                    KIN-G +
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium">
                    Office Portal
                  </p>
                </div>
              )}
            </div>
            {/* Mobile Close Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseMobile}
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <X className="h-4 w-4 text-sidebar-foreground" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      onClick={handleCloseMobile}
                        className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-semibold shadow-sm"
                            : "hover:bg-sidebar-accent/60 text-sidebar-foreground hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                        isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"
                      }`} />
                      {!isCollapsed && (
                        <span className="font-medium transition-colors">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mt-auto p-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/60">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-medium">
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
