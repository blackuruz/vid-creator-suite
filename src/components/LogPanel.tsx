import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal } from 'lucide-react';

interface LogPanelProps {
  logs: string[];
}

export function LogPanel({ logs }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Terminal className="w-4 h-4" />
          System Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-32 w-full">
          <div ref={scrollRef} className="p-3 font-mono text-xs space-y-1">
            {logs.length === 0 ? (
              <div className="text-muted-foreground italic">
                No logs yet. Start the scheduler to see activity...
              </div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className="text-foreground/80 hover:text-foreground hover:bg-muted/50 p-1 rounded transition-colors"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}