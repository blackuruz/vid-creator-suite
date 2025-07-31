import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  File, 
  Video, 
  Music, 
  Image, 
  Trash2, 
  FolderOpen,
  Download,
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';
import { fileAPI, FileList } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function FileManager() {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [files, setFiles] = useState<FileList>({ videos: [], audios: [], thumbnails: [] });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<'videos' | 'audios' | 'thumbnails'>('videos');
  const { toast } = useToast();

  useEffect(() => {
    // Load profiles list - in real implementation, this would come from API
    setProfiles(['Tech Channel', 'Gaming Content', 'Music Covers']);
    if (profiles.length > 0) {
      setSelectedProfile(profiles[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      loadFiles();
    }
  }, [selectedProfile]);

  const loadFiles = async () => {
    if (!selectedProfile) return;
    
    setLoading(true);
    try {
      const response = await fileAPI.listFiles(selectedProfile);
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedProfile || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select profile and files",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_name', selectedProfile);
      formData.append('file_type', uploadType);
      
      selectedFiles.forEach(file => {
        formData.append('files[]', file);
      });

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [uploadType]: progress }));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);

      await fileAPI.uploadFiles(formData);
      
      toast({
        title: "Success",
        description: `${selectedFiles.length} files uploaded successfully`,
      });
      
      setShowUploadDialog(false);
      setSelectedFiles([]);
      setUploadProgress({});
      loadFiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Upload failed",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFile = async (fileName: string, fileType: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await fileAPI.deleteFile(selectedProfile, fileName, fileType);
      toast({
        title: "Success",
        description: `File "${fileName}" deleted successfully`,
      });
      loadFiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'videos') return <Video className="w-4 h-4 text-blue-500" />;
    if (type === 'audios') return <Music className="w-4 h-4 text-green-500" />;
    if (type === 'thumbnails') return <Image className="w-4 h-4 text-purple-500" />;
    return <File className="w-4 h-4" />;
  };

  const getFileSize = (fileName: string) => {
    // Mock file sizes - in real implementation, this would come from the API
    return `${(Math.random() * 50 + 5).toFixed(1)} MB`;
  };

  const FileTypeTab = ({ type, files, icon: Icon, color }: { 
    type: string; 
    files: string[]; 
    icon: any; 
    color: string; 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="font-medium capitalize">{type}</span>
          <Badge variant="secondary">{files.length} files</Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setUploadType(type as any);
            setShowUploadDialog(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload {type}
        </Button>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No {type} uploaded yet</p>
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => {
                setUploadType(type as any);
                setShowUploadDialog(true);
              }}
            >
              <Upload className="w-4 h-4" />
              Upload {type}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((fileName, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getFileIcon(fileName, type)}
                    <span className="text-sm font-medium truncate" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFile(fileName, type)}
                    className="ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{getFileSize(fileName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Added:</span>
                    <span>Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-red to-brand-dark bg-clip-text text-transparent">
            File Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your video content and assets
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile} value={profile}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadFiles} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {!selectedProfile ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a profile to manage files.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos" className="gap-2">
              <Video className="w-4 h-4" />
              Videos ({files.videos.length})
            </TabsTrigger>
            <TabsTrigger value="audios" className="gap-2">
              <Music className="w-4 h-4" />
              Audio ({files.audios.length})
            </TabsTrigger>
            <TabsTrigger value="thumbnails" className="gap-2">
              <Image className="w-4 h-4" />
              Thumbnails ({files.thumbnails.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            <FileTypeTab 
              type="videos" 
              files={files.videos} 
              icon={Video} 
              color="text-blue-500" 
            />
          </TabsContent>
          
          <TabsContent value="audios">
            <FileTypeTab 
              type="audios" 
              files={files.audios} 
              icon={Music} 
              color="text-green-500" 
            />
          </TabsContent>
          
          <TabsContent value="thumbnails">
            <FileTypeTab 
              type="thumbnails" 
              files={files.thumbnails} 
              icon={Image} 
              color="text-purple-500" 
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload {uploadType}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Files</Label>
              <Input
                type="file"
                multiple
                accept={
                  uploadType === 'videos' ? '.mp4,.mov,.mkv' :
                  uploadType === 'audios' ? '.mp3,.wav,.m4a' :
                  '.png,.jpg,.jpeg'
                }
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
              <p className="text-xs text-muted-foreground">
                {uploadType === 'videos' && 'Supported: MP4, MOV, MKV'}
                {uploadType === 'audios' && 'Supported: MP3, WAV, M4A'}
                {uploadType === 'thumbnails' && 'Supported: PNG, JPG, JPEG'}
              </p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded flex justify-between">
                      <span>{file.name}</span>
                      <span className="text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadProgress[uploadType] && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress[uploadType]} />
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="brand" 
                onClick={handleFileUpload}
                disabled={selectedFiles.length === 0}
              >
                Upload Files
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}