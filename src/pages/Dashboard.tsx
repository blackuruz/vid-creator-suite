import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Play, 
  Pause, 
  Youtube, 
  Calendar, 
  FileText, 
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { profileAPI } from '@/lib/api';

interface DashboardStats {
  totalProfiles: number;
  activeProfiles: number;
  scheduledJobs: number;
  completedToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProfiles: 0,
    activeProfiles: 0,
    scheduledJobs: 0,
    completedToday: 0
  });
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // This would normally come from your API
      // For now, we'll use mock data
      setStats({
        totalProfiles: 5,
        activeProfiles: 3,
        scheduledJobs: 12,
        completedToday: 8
      });
      
      // Load recent profiles for quick overview
      setProfiles([
        { name: 'Tech Channel', status: 'active', nextUpload: '14:30' },
        { name: 'Gaming Content', status: 'scheduled', nextUpload: '18:00' },
        { name: 'Music Covers', status: 'paused', nextUpload: '20:15' },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Profiles',
      value: stats.totalProfiles,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Profiles',
      value: stats.activeProfiles,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Scheduled Jobs',
      value: stats.scheduledJobs,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-red to-brand-dark bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your YouTube automation system
          </p>
        </div>
        <Button variant="brand" className="gap-2">
          <Youtube className="w-4 h-4" />
          Quick Upload
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="w-4 h-4" />
              Manage Profiles
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" />
              Edit Content
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Upload
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-red to-brand-dark"></div>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Next upload: {profile.nextUpload}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={profile.status === 'active' ? 'default' : 
                           profile.status === 'scheduled' ? 'secondary' : 'outline'}
                  >
                    {profile.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Requests</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Queue</span>
                <span>23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}