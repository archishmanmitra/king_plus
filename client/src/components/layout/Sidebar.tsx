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
  Network,
  ChevronRight,
  Sparkles,
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
    title: "Teams",
    url: "/teams",
    icon: Network,
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
  // {
  //   title: "Payroll",
  //   url: "/payroll",
  //   icon: DollarSign,
  //   roles: ["global_admin", "hr_manager"],
  // },
  // {
  //   title: "Expenses",
  //   url: "/expenses",
  //   icon: FileText,
  //   roles: ["global_admin", "hr_manager", "manager", "employee"],
  // },
  // {
  //   title: "Performance",
  //   url: "/performance",
  //   icon: Target,
  //   roles: [
  //     "global_admin",
  //     "hr_manager",
  //     "employee",
  //     "manager",
  //   ],
  // },
  // {
  //   title: "Projects",
  //   url: "/projects",
  //   icon: FolderOpen,
  //   roles: ["global_admin", "hr_manager", "manager", "employee"],
  // },
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: TrendingUp,
  //   roles: ["global_admin", "hr_manager", "manager"],
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  //   roles: ["global_admin", "hr_manager"],
  // },
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
    <Sidebar 
      className={`
        ${isCollapsed ? "w-16" : "w-64"} 
        bg-transparent border-none shadow-none
      `} 
      collapsible="icon"
    >
      <SidebarContent className="h-full bg-gradient-to-b from-background/90 via-background/80 to-background/90 backdrop-blur-xl backdrop-saturate-150 border-r border-border/20 scrollbar-thin">
        {/* Premium Logo/Brand Section */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark shadow-md shadow-primary/20 flex items-center justify-center">
                  <img src="/kinglogo.svg" height={24} width={24} className="rounded-lg filter brightness-0 invert" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="space-y-0.5">
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
                className="h-8 w-8 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all duration-200 rounded-lg"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <SidebarGroup className="px-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider mb-3 px-3">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {filteredItems.map((item, index) => {
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        onClick={handleCloseMobile}
                        className={`
                          group relative flex items-center space-x-3 p-3 rounded-xl 
                          transition-all duration-200 ease-out
                          ${active
                            ? "bg-primary/15 text-primary font-semibold shadow-sm border border-primary/20"
                            : "hover:bg-foreground/8 text-foreground/70 hover:text-foreground"
                          }
                          ${!isCollapsed ? "justify-start" : "justify-center"}
                        `}
                      >
                        {/* Active indicator */}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        
                        {/* Icon */}
                        <item.icon className={`
                          h-5 w-5 flex-shrink-0 transition-colors
                          ${active ? "text-primary" : "text-foreground/60 group-hover:text-foreground"}
                        `} />
                        
                        {/* Text */}
                        {!isCollapsed && (
                          <span className="font-medium text-sm transition-colors">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section */}
        {!isCollapsed && user && (
          <div className="mt-auto p-4">
            <div className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 shadow-sm p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed user avatar */}
        {isCollapsed && user && (
          <div className="mt-auto p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md mx-auto">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
