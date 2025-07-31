import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Play, Square, LogOut, Cpu, HardDrive } from 'lucide-react';
import { SystemStats } from '@/lib/api';

interface HeaderProps {
  systemStats: SystemStats;
  schedulerRunning: boolean;
  onStartScheduler: () => void;
  onStopScheduler: () => void;
}

export function Header({ 
  systemStats, 
  schedulerRunning, 
  onStartScheduler, 
  onStopScheduler 
}: HeaderProps) {
  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Badge variant={schedulerRunning ? 'default' : 'secondary'}>
              {schedulerRunning ? 'Scheduler Running' : 'Scheduler Stopped'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* System Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4" />
              <span>CPU: {systemStats.cpu.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4" />
              <span>RAM: {systemStats.ram.toFixed(1)}%</span>
            </div>
          </div>

          {/* Scheduler Controls */}
          <div className="flex items-center gap-2">
            {schedulerRunning ? (
              <Button variant="danger" size="sm" onClick={onStopScheduler}>
                <Square className="w-4 h-4" />
                Stop Scheduler
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={onStartScheduler}>
                <Play className="w-4 h-4" />
                Start Scheduler
              </Button>
            )}
          </div>

          {/* Logout */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}