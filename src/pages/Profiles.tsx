import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Youtube, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Clock,
  Calendar
} from 'lucide-react';
import { profileAPI, Profile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const YOUTUBE_CATEGORIES = {
  "People & Blogs": "22",
  "Music": "10", 
  "Gaming": "20",
  "Entertainment": "24",
  "Howto & Style": "26",
  "Science & Technology": "28"
};

export default function Profiles() {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProfileName, setNewProfileName] = useState('');
  const [clientSecretFile, setClientSecretFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      // In a real implementation, you'd have an endpoint that returns all profiles
      // For now, we'll simulate with some mock data
      const mockProfiles = {
        "Tech Channel": {
          name: "Tech Channel",
          token_file: "/path/to/token",
          client_secret_file: "/path/to/secret",
          video_folder: "/data/tech/videos",
          audio_folder: "/data/tech/audio",
          thumb_folder: "/data/tech/thumbnails",
          output_folder: "/data/output",
          title_file: "/data/tech/titles.txt",
          desc_file: "/data/tech/descriptions.txt",
          num_audio: "15",
          num_video: "5",
          category: "Science & Technology",
          start_time: "08:00",
          schedule_slots: "07:00,13:00,19:00",
          monetization: true,
          auth_status: "Authenticated",
          auth_class: "text-success"
        }
      };
      setProfiles(mockProfiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName || !clientSecretFile) {
      toast({
        title: "Error",
        description: "Please provide profile name and client secret file",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_name', newProfileName);
      formData.append('client_secret_file', clientSecretFile);

      await profileAPI.addProfile(formData);
      toast({
        title: "Success",
        description: `Profile "${newProfileName}" created successfully`,
      });
      
      setShowAddDialog(false);
      setNewProfileName('');
      setClientSecretFile(null);
      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create profile",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProfile = async (profileName: string) => {
    if (!confirm(`Are you sure you want to delete "${profileName}"?`)) return;

    try {
      await profileAPI.deleteProfile(profileName);
      toast({
        title: "Success",
        description: `Profile "${profileName}" deleted successfully`,
      });
      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete profile",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!selectedProfile) return;

    try {
      await profileAPI.saveProfile({
        profile_name: selectedProfile.name,
        ...selectedProfile
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setShowEditDialog(false);
      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (authStatus?: string) => {
    switch (authStatus) {
      case 'Authenticated':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Authenticated (Token Expired)':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profiles</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
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
            Profiles
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your YouTube automation profiles
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="brand" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Google Client Secret File</Label>
                <Input
                  id="clientSecret"
                  type="file"
                  accept=".json"
                  onChange={(e) => setClientSecretFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand">
                  Create Profile
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(profiles).map(([name, profile]) => (
          <Card key={name} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-brand-dark rounded-lg flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(profile.auth_status)}
                      <span className={`text-xs ${profile.auth_class || 'text-muted-foreground'}`}>
                        {profile.auth_status || 'Not Authenticated'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{profile.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Time:</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {profile.start_time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monetization:</span>
                  <Badge variant={profile.monetization ? 'default' : 'secondary'}>
                    {profile.monetization ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => {
                    setSelectedProfile(profile);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                
                {profile.auth_status !== 'Authenticated' && (
                  <Button
                    size="sm"
                    variant="youtube"
                    className="flex-1 gap-1"
                    onClick={() => {
                      window.open(profileAPI.authenticate(name), '_blank');
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Auth
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProfile(name)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile: {selectedProfile?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProfile && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Audio Files Count</Label>
                    <Input
                      value={selectedProfile.num_audio}
                      onChange={(e) => setSelectedProfile({
                        ...selectedProfile,
                        num_audio: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Video Files Count</Label>
                    <Input
                      value={selectedProfile.num_video}
                      onChange={(e) => setSelectedProfile({
                        ...selectedProfile,
                        num_video: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={selectedProfile.category}
                    onValueChange={(value) => setSelectedProfile({
                      ...selectedProfile,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(YOUTUBE_CATEGORIES).map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="monetization"
                    checked={selectedProfile.monetization}
                    onCheckedChange={(checked) => setSelectedProfile({
                      ...selectedProfile,
                      monetization: checked
                    })}
                  />
                  <Label htmlFor="monetization">Enable Monetization</Label>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Content paths are auto-configured based on profile name. 
                    Upload files using the File Manager.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label>Video Folder</Label>
                  <Input value={selectedProfile.video_folder} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Audio Folder</Label>
                  <Input value={selectedProfile.audio_folder} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnails Folder</Label>
                  <Input value={selectedProfile.thumb_folder} disabled />
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={selectedProfile.start_time}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      start_time: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Slots (comma-separated)
                  </Label>
                  <Input
                    value={selectedProfile.schedule_slots}
                    onChange={(e) => setSelectedProfile({
                      ...selectedProfile,
                      schedule_slots: e.target.value
                    })}
                    placeholder="07:00,13:00,19:00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter upload times in HH:MM format, separated by commas
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button variant="brand" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}