import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SystemMonitor } from '@/components/SystemMonitor';
import { LogPanel } from '@/components/LogPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { io, Socket } from 'socket.io-client';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [systemStats, setSystemStats] = useState({ cpu: 0, ram: 0 });
  const [schedulerRunning, setSchedulerRunning] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('new_log', (data) => {
      setLogs(prev => [...prev.slice(-49), data.data]);
    });

    newSocket.on('system_stats', (stats) => {
      setSystemStats(stats);
    });

    newSocket.on('scheduler_status', (status) => {
      setSchedulerRunning(status.running);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startScheduler = () => {
    socket?.emit('start_scheduler');
  };

  const stopScheduler = () => {
    socket?.emit('stop_scheduler');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header 
            systemStats={systemStats}
            schedulerRunning={schedulerRunning}
            onStartScheduler={startScheduler}
            onStopScheduler={stopScheduler}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          
          <div className="border-t bg-muted/30">
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <SystemMonitor stats={systemStats} />
                </div>
                <div className="lg:col-span-2">
                  <LogPanel logs={logs} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}