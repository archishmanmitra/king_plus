
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Settings, User, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-2 pb-0.5 md:pt-4 md:pb-0.5">
      <div className="
        relative mx-auto max-w-7xl
        md:rounded-3xl md:border md:border-white/10
        md:bg-black/5 md:backdrop-blur-xl md:backdrop-saturate-150
        md:shadow-2xl md:shadow-black/20
        transition-all duration-300 ease-out
      ">
        {/* Glass effect overlay removed to match sidebar styling */}
        
        {/* Main content */}
        <div className="relative flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          {/* Left side - Search and Sidebar */}
          <div className="flex items-center space-x-4 flex-1">
            <SidebarTrigger className="block lg:hidden h-8 w-8 md:h-9 md:w-9 hover:bg-muted/50 transition-all duration-200 rounded-xl hover:scale-105" />
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="Search employees, projects, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="
                    pl-9 pr-9 h-9 md:h-10 text-sm md:text-base
                    bg-background/50 border-border/60
                    rounded-full transition-all duration-200
                    focus:bg-background/80 focus:border-primary/50
                    focus:ring-2 focus:ring-primary/20
                    hover:bg-background/60 hover:border-border/80
                    placeholder:text-muted-foreground/70
                  "
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 rounded-lg hover:bg-muted/50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Center - Welcome message (hidden on smaller screens) */}
          {/* <div className="hidden lg:flex items-center">
            <div className="text-center">
              <h1 className="text-sm font-semibold text-foreground tracking-tight">
                {user?.department} Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Welcome back, {user?.name}
              </p>
            </div>
          </div> */}

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="
                relative h-10 w-10 md:h-12 md:w-12 rounded-full
                bg-background/30 backdrop-blur-sm
                hover:bg-background/50 transition-all duration-200
                hover:scale-105 text-foreground
                border border-border/30 hover:border-border/50
                shadow-sm hover:shadow-md
              "
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground flex items-center justify-center shadow-sm">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="
                    h-10 md:h-12 space-x-3 px-3 md:px-4 rounded-full
                    bg-background/30 backdrop-blur-sm
                    hover:bg-background/50 transition-all duration-200
                    hover:scale-105 text-foreground
                    border border-border/30 hover:border-border/50
                    shadow-sm hover:shadow-md
                  "
                >
                  <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/30">
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
              <DropdownMenuContent 
                className="
                  w-56 shadow-xl border-border/60 
                  bg-background/95 backdrop-blur-xl
                  rounded-xl mt-2
                " 
                align="end" 
                forceMount
              >
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
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')} 
                  className="hover:bg-muted/50 transition-colors rounded-lg mx-1"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-muted/50 transition-colors rounded-lg mx-1">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="hover:bg-destructive/10 text-destructive transition-colors rounded-lg mx-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
