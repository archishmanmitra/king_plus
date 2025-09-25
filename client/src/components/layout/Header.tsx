import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'global_admin':
        return 'destructive';
      case 'hr_manager':
        return 'default';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="sticky top-0 z-50 w-full relative overflow-hidden border-b border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_16px_hsl(var(--ring)/0.2)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent" />
      <div className="relative flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-9 w-9 hover:bg-muted/50 transition-colors rounded-lg" />
          <div className="hidden md:block">
            <h1 className="text-base md:text-lg font-semibold text-foreground tracking-tight">
              {user?.department} Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 transition-colors text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground flex items-center justify-center shadow-sm">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 space-x-3 px-3 hover:bg-muted/50 transition-colors rounded-lg text-foreground">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground font-semibold">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                  <Badge variant={getRoleBadgeVariant(user?.role || '')} className="text-xs font-medium">
                    {formatRole(user?.role || '')}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 shadow-lg border-border/60 bg-background/95 backdrop-blur-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-foreground">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground font-medium">
                    {user?.email}
                  </p>
                  <Badge variant={getRoleBadgeVariant(user?.role || '')} className="text-xs w-fit font-medium">
                    {formatRole(user?.role || '')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-muted/50 transition-colors">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-muted/50 transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem onClick={logout} className="hover:bg-destructive/10 text-destructive transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
