import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Home,
  Users,
  Settings,
  FileText,
  Upload,
  Play,
  Youtube,
  Activity,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Profiles', url: '/profiles', icon: Users },
  { title: 'File Manager', url: '/files', icon: Upload },
  { title: 'Text Editor', url: '/editor', icon: FileText },
  { title: 'Scheduler', url: '/scheduler', icon: Play },
  { title: 'Monitor', url: '/monitor', icon: Activity },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const accountItems = [
  { title: 'Profile', url: '/profile', icon: User },
];

export function Sidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-gradient-to-r from-brand-red/20 to-brand-dark/20 text-brand-red border-r-2 border-brand-red font-medium' 
      : 'hover:bg-muted/50 transition-colors';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarUI
      collapsible="icon"
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-red to-brand-dark rounded-lg flex items-center justify-center">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">Zombload Panel</span>
              <span className="text-xs text-muted-foreground">YouTube Automation</span>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Account
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="mt-auto p-2 space-y-2">
        {/* User Info */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xs">
                {getInitials(user.user_metadata?.name || user.email?.split('@')[0] || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.user_metadata?.name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className={`w-full gap-2 ${isCollapsed ? 'px-2' : ''}`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
        
        <SidebarTrigger className="w-full" />
      </div>
    </SidebarUI>
  );
}