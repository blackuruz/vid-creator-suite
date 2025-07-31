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
import {
  Home,
  Users,
  Settings,
  FileText,
  Upload,
  Play,
  Youtube,
  Activity,
} from 'lucide-react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Profiles', url: '/profiles', icon: Users },
  { title: 'File Manager', url: '/files', icon: Upload },
  { title: 'Text Editor', url: '/editor', icon: FileText },
  { title: 'Scheduler', url: '/scheduler', icon: Play },
  { title: 'Monitor', url: '/monitor', icon: Activity },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function Sidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-gradient-to-r from-brand-red/20 to-brand-dark/20 text-brand-red border-r-2 border-brand-red font-medium' 
      : 'hover:bg-muted/50 transition-colors';

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
      </SidebarContent>
      
      <div className="mt-auto p-2">
        <SidebarTrigger className="w-full" />
      </div>
    </SidebarUI>
  );
}