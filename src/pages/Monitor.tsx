import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Youtube, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  Globe
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  status: 'success' | 'warning' | 'danger';
  unit: string;
}

interface JobStatus {
  profile: string;
  status: 'running' | 'scheduled' | 'completed' | 'failed';
  progress: number;
  nextRun: string;
  lastRun: string;
}

export default function Monitor() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, status: 'success', unit: '%' },
    { name: 'RAM Usage', value: 68, status: 'warning', unit: '%' },
    { name: 'Disk Usage', value: 23, status: 'success', unit: '%' },
    { name: 'Network I/O', value: 12, status: 'success', unit: 'MB/s' },
  ]);

  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([
    {
      profile: 'Tech Channel',
      status: 'running',
      progress: 75,
      nextRun: '14:00',
      lastRun: '08:00'
    },
    {
      profile: 'Gaming Content',
      status: 'scheduled',
      progress: 0,
      nextRun: '16:00',
      lastRun: '12:00'
    },
    {
      profile: 'Music Covers',
      status: 'completed',
      progress: 100,
      nextRun: '20:00',
      lastRun: '14:30'
    },
  ]);

  const [apiMetrics, setApiMetrics] = useState({
    totalRequests: 1247,
    successRate: 98.5,
    averageResponseTime: 245,
    rateLimit: 85
  });

  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setSystemMetrics(metrics => 
        metrics.map(metric => ({
          ...metric,
          value: Math.max(5, Math.min(95, metric.value + (Math.random() - 0.5) * 10))
        }))
      );
      setRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Pause className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricColor = (status: 'success' | 'warning' | 'danger') => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-red to-brand-dark bg-clip-text text-transparent">
            System Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of your automation system
          </p>
        </div>
        
        <Button variant="outline" onClick={refreshData} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.name}
                      </p>
                      <p className={`text-2xl font-bold mt-1 ${getMetricColor(metric.status)}`}>
                        {metric.value.toFixed(1)}{metric.unit}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {metric.name === 'CPU Usage' && <Cpu className="w-6 h-6" />}
                      {metric.name === 'RAM Usage' && <HardDrive className="w-6 h-6" />}
                      {metric.name === 'Disk Usage' && <HardDrive className="w-6 h-6" />}
                      {metric.name === 'Network I/O' && <Network className="w-6 h-6" />}
                    </div>
                  </div>
                  <Progress value={metric.value} className="mt-4 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="outline">2d 14h 23m</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Processes</span>
                    <Badge variant="outline">127</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Size</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Youtube className="w-5 h-5" />
                  Upload Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today</span>
                    <Badge variant="default">12 uploads</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <Badge variant="secondary">84 uploads</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="outline">98.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Processing</span>
                    <Badge variant="outline">4.2 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Wait</span>
                    <Badge variant="outline">1.8 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge variant="outline">1.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Job Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobStatuses.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.profile}</p>
                        <p className="text-sm text-muted-foreground">
                          Last run: {job.lastRun} • Next: {job.nextRun}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.status === 'running' && (
                        <div className="flex items-center gap-2">
                          <Progress value={job.progress} className="w-24 h-2" />
                          <span className="text-sm">{job.progress}%</span>
                        </div>
                      )}
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold mt-1">{apiMetrics.totalRequests.toLocaleString()}</p>
                  </div>
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">{apiMetrics.successRate}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold mt-1">{apiMetrics.averageResponseTime}ms</p>
                  </div>
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
                    <p className="text-2xl font-bold mt-1 text-orange-600">{apiMetrics.rateLimit}%</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
                <Progress value={apiMetrics.rateLimit} className="mt-4 h-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Endpoints Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { endpoint: '/api/upload', status: 'healthy', response: '245ms' },
                  { endpoint: '/api/profiles', status: 'healthy', response: '120ms' },
                  { endpoint: '/api/files', status: 'healthy', response: '180ms' },
                  { endpoint: '/api/auth', status: 'healthy', response: '95ms' },
                ].map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-mono text-sm">{api.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{api.response}</span>
                      <Badge variant="outline" className="text-green-600">
                        {api.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                System Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                <div className="space-y-1">
                  <div>[2024-01-15 14:23:45] INFO: Scheduler started successfully</div>
                  <div>[2024-01-15 14:23:46] INFO: Profile 'Tech Channel' loaded</div>
                  <div>[2024-01-15 14:23:47] INFO: Profile 'Gaming Content' loaded</div>
                  <div>[2024-01-15 14:24:12] INFO: Starting upload job for 'Tech Channel'</div>
                  <div>[2024-01-15 14:24:15] INFO: Video processing started</div>
                  <div>[2024-01-15 14:25:30] INFO: Upload to YouTube initiated</div>
                  <div>[2024-01-15 14:26:45] SUCCESS: Video uploaded successfully - ID: abc123xyz</div>
                  <div>[2024-01-15 14:26:46] INFO: Thumbnail set successfully</div>
                  <div>[2024-01-15 14:26:47] INFO: Monetization enabled</div>
                  <div>[2024-01-15 14:26:48] INFO: Job completed for 'Tech Channel'</div>
                  <div>[2024-01-15 14:30:00] INFO: Next job scheduled for 16:00</div>
                  <div className="text-yellow-400">[2024-01-15 14:35:12] WARN: Rate limit approaching (85%)</div>
                  <div>[2024-01-15 14:40:00] INFO: System health check - All systems operational</div>
                  <div className="animate-pulse">|</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}