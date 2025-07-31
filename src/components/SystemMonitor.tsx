import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, HardDrive } from 'lucide-react';
import { SystemStats } from '@/lib/api';

interface SystemMonitorProps {
  stats: SystemStats;
}

export function SystemMonitor({ stats }: SystemMonitorProps) {
  const getCpuColor = (value: number) => {
    if (value > 80) return 'bg-danger';
    if (value > 60) return 'bg-warning';
    return 'bg-success';
  };

  const getRamColor = (value: number) => {
    if (value > 85) return 'bg-danger';
    if (value > 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Cpu className="w-4 h-4" />
          System Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              CPU Usage
            </span>
            <span className="font-mono">{stats.cpu.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.cpu} 
            className="h-2"
            // Apply custom styling based on CPU usage
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <HardDrive className="w-3 h-3" />
              RAM Usage
            </span>
            <span className="font-mono">{stats.ram.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.ram} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}