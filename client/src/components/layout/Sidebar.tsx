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
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
  ChevronDown,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  title: string;
  url: string;
  icon: any;
  roles: string[];
  children?: Array<{ title: string; url: string; roles?: string[] }>;
};

const navigationItems: NavItem[] = [
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
    title: "My Profile",
    url: "/profile",
    icon: UserCheck,
    roles: [
      "global_admin",
      "hr_manager",
      "manager",
      "employee",
    ],
    children: [
      { title: "Personal", url: "/profile?tab=personal" },
      { title: "Official", url: "/profile?tab=official" },
      { title: "Financial", url: "/profile?tab=financial" },
    ],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    roles: ["global_admin", "hr_manager"],
    children: [
      { title: "Grid View", url: "/employees?tab=grid" },
      { title: "Table View", url: "/employees?tab=table" },
      { title: "Invitations", url: "/employees?tab=invitations" },
    ],
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Network,
    roles: ["global_admin", "hr_manager"],
    children: [
      { title: "Chart View", url: "/teams?tab=chart" },
      { title: "List View", url: "/teams?tab=list" },
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
    children: [
      { title: "Today's Attendance", url: "/attendance?tab=today" },
      { title: "Attendance History", url: "/attendance?tab=history" },
      { title: "Pending Approvals", url: "/attendance?tab=pending" },
      { title: "Approvals", url: "/attendance?tab=approvals" },
      { title: "Reports", url: "/attendance?tab=reports" },
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
    children: [
      { title: "My Requests", url: "/leave?tab=requests" },
      { title: "Team Requests", url: "/leave?tab=team" },
      { title: "Holiday Calendar", url: "/leave?tab=holidays" },
    ],
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: DollarSign,
    roles: ["global_admin", "hr_manager"],
  },
  {
    title: "My Payslip",
    url: "/payroll-sheet",
    icon: FileText,
    roles: ["global_admin", "hr_manager", "employee", "manager"],
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
    roles: ["global_admin", "hr_manager", "manager", "employee"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: TrendingUp,
    roles: ["global_admin", "hr_manager", "manager"],
  },
  {
    title: "Audit Report",
    url: "/audit-report",
    icon: FileText,
    roles: ["global_admin", "hr_manager", "manager", "employee"],
  },
  {
    title: "Awards & Celebration",
    url: "/awards",
    icon: Award,
    roles: ["global_admin", "hr_manager", "manager", "employee"],
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
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const isExpanded = (title: string, url: string) =>
    expanded[title] ?? currentPath.startsWith(url);
  const toggleExpanded = (title: string) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const isActive = (path: string) => currentPath.startsWith(path);
  const isChildActive = (childUrl: string) => {
    const [path, query] = childUrl.split('?');
    const currentQuery = location.search;
    
    // If the child URL has query parameters, check both path and query
    if (query) {
      return currentPath === path && currentQuery === `?${query}`;
    }
    
    // If no query parameters, just check the path
    return currentPath === childUrl;
  };
  const isCollapsed = state === "collapsed";

  const handleCloseMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar 
      className={`
        ${isCollapsed ? "w-16" : "w-72"} 
        bg-transparent border-none shadow-none
      `} 
      collapsible="icon"
    >
      <SidebarContent className="h-full md:m-4 md:rounded-3xl md:bg-black/5 md:backdrop-blur-xl md:backdrop-saturate-150 md:border md:border-white/10 md:shadow-2xl md:shadow-black/20 scrollbar-hidden flex flex-col overflow-hidden">
        {/* Premium Logo/Brand Section */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark shadow-md shadow-primary/20 flex items-center justify-center">
                  <img src="/kinglogo.svg" height={24} width={24} className="rounded-lg filter brightness-0 invert" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div> 
              </div>
              {!isCollapsed && (
                <div className="space-y-0.5 ">
                  <h1 className="text-foreground font-bold text-lg tracking-tight">
                    KIN-G +
                  </h1>
                  <p className="text-xs text-blue-500 font-medium">
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

        {/* Navigation Section (scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
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
                  const groupExpanded = isExpanded(item.title, item.url);

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
                              ? "text-primary font-semibold"
                              : "hover:bg-foreground/8 text-foreground/70 hover:text-foreground"}
                            ${!isCollapsed ? "justify-start" : "justify-center"}
                          `}
                        >
                          {/* Active indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_6px_hsl(var(--sidebar-ring)/0.6)]" />
                          )}

                          {/* Icon */}
                          <item.icon
                            className={`
                              h-5 w-5 flex-shrink-0 transition-colors
                              ${active ? "text-primary" : "text-foreground/60 group-hover:text-foreground"}
                            `}
                          />

                          {/* Text */}
                          {!isCollapsed && (
                            <span className="font-medium text-sm transition-colors">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>

                      {item.children && item.children.length > 0 && !isCollapsed && (
                        <SidebarMenuAction
                          aria-label={groupExpanded ? "Collapse" : "Expand"}
                          onClick={() => toggleExpanded(item.title)}
                          className="right-2"
                        >
                          {groupExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuAction>
                      )}

                      {/* Submenu for tabs */}
                      {item.children && item.children.length > 0 && groupExpanded && (
                        <SidebarMenuSub>
                          {item.children
                            .filter((child) => !child.roles || (user && child.roles.includes(user.role)))
                            .map((child) => {
                              const childActive = isChildActive(child.url);
                              return (
                                <SidebarMenuSubItem key={child.title}>
                                  <SidebarMenuSubButton asChild isActive={childActive}>
                                    <NavLink to={child.url} onClick={handleCloseMobile}>
                                      <span>{child.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && user && (
          <div className="mt-auto p-4">
            <div className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 shadow-sm p-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {/* Active pill */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-sm">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.position}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed user avatar */}
        {isCollapsed && user && (
          <div className="mt-auto p-4">
            <div className="relative mx-auto w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              {/* Active pill for collapsed state */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-sm">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
