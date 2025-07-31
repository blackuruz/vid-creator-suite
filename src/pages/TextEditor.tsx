import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Type,
  MessageSquare,
  Shuffle,
  Copy
} from 'lucide-react';
import { fileAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function TextEditor() {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [titles, setTitles] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
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
      loadTextFiles();
    }
  }, [selectedProfile]);

  const loadTextFiles = async () => {
    if (!selectedProfile) return;
    
    setLoading(true);
    try {
      const [titlesResponse, descriptionsResponse] = await Promise.all([
        fileAPI.getTextFile(selectedProfile, 'titles'),
        fileAPI.getTextFile(selectedProfile, 'descriptions')
      ]);
      
      setTitles(titlesResponse.data.content);
      setDescriptions(descriptionsResponse.data.content);
    } catch (error) {
      console.error('Failed to load text files:', error);
      toast({
        title: "Error",
        description: "Failed to load text files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTextFile = async (fileType: 'titles' | 'descriptions', content: string) => {
    if (!selectedProfile) return;
    
    setSaving(true);
    try {
      await fileAPI.saveTextFile(selectedProfile, fileType, content);
      setLastSaved(new Date().toLocaleTimeString());
      toast({
        title: "Success",
        description: `${fileType} saved successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to save ${fileType}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const countLines = (text: string) => {
    return text.split('\n').filter(line => line.trim() !== '').length;
  };

  const generateSampleTitles = () => {
    const samples = [
      "Amazing Tech Discovery That Will Change Everything!",
      "Top 10 Secrets Nobody Tells You About {topic|programming|technology|AI}",
      "Why {Everyone|Most People|Experts} Are Wrong About {topic|this|technology}",
      "The {Ultimate|Complete|Definitive} Guide to {topic|success|productivity}",
      "I Tried {Something|This Method|This Trick} for 30 Days - Here's What Happened",
      "{Shocking|Surprising|Incredible} Results After {Using|Trying|Testing} This Method"
    ];
    
    const randomSamples = samples.sort(() => 0.5 - Math.random()).slice(0, 3);
    const existingTitles = titles ? titles + '\n' : '';
    setTitles(existingTitles + randomSamples.join('\n'));
  };

  const generateSampleDescriptions = () => {
    const samples = [
      `Welcome to our channel! In today's video, we're diving deep into {topic|technology|programming|AI}.

🔥 What you'll learn:
- {Key point 1|Important concept|Main idea}
- {Key point 2|Advanced technique|Pro tip}
- {Key point 3|Secret method|Bonus insight}

💬 Don't forget to:
- Like this video if it helped you
- Subscribe for more {content type|tutorials|tips}
- Comment your thoughts below
- Share with your friends

📱 Follow us:
- Website: {your-website.com}
- Twitter: {@youraccount}
- Instagram: {@youraccount}

#technology #tutorial #education`,

      `🚀 Ready to {achieve|learn|master} {topic|this skill|this concept}?

In this comprehensive guide, we'll show you exactly how to {accomplish goal|solve problem|get results}.

⏰ Timestamps:
0:00 - Introduction
{1:30|2:00|2:30} - Getting Started
{5:00|6:00|7:00} - Advanced Techniques
{10:00|12:00|15:00} - Final Tips

🎯 Resources mentioned:
- {Resource 1|Tool|Software}: {link}
- {Resource 2|Book|Course}: {link}
- {Resource 3|Website|Platform}: {link}

Thanks for watching! See you in the next one! 🎉

#tutorial #howto #guide`
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    const existingDescriptions = descriptions ? descriptions + '\n\n---\n\n' : '';
    setDescriptions(existingDescriptions + randomSample);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-red to-brand-dark bg-clip-text text-transparent">
            Text Editor
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit titles and descriptions for your videos
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
          
          <Button variant="outline" onClick={loadTextFiles} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {!selectedProfile ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a profile to edit text files.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Titles Editor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Video Titles
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {countLines(titles)} titles
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(titles, 'Titles')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={titles}
                  onChange={(e) => setTitles(e.target.value)}
                  placeholder="Enter video titles, one per line..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{option1|option2|option3}"} for random variations
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSampleTitles}
                  className="gap-2"
                >
                  <Shuffle className="w-3 h-3" />
                  Add Samples
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => saveTextFile('titles', titles)}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-3 h-3" />
                  Save Titles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Descriptions Editor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Video Descriptions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {countLines(descriptions)} descriptions
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(descriptions, 'Descriptions')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={descriptions}
                  onChange={(e) => setDescriptions(e.target.value)}
                  placeholder="Enter video descriptions, separated by '---'..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple descriptions with "---" on a new line
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSampleDescriptions}
                  className="gap-2"
                >
                  <Shuffle className="w-3 h-3" />
                  Add Sample
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => saveTextFile('descriptions', descriptions)}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-3 h-3" />
                  Save Descriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Bar */}
      {lastSaved && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Last saved at {lastSaved}
          </AlertDescription>
        </Alert>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Using Text Spinning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Title Examples:</h4>
              <div className="space-y-1 font-mono text-xs bg-muted p-3 rounded">
                <div>{"Amazing {Discovery|Innovation|Breakthrough}!"}</div>
                <div>{"Top {5|10|15} {Tips|Secrets|Tricks}"}</div>
                <div>{"How to {Master|Learn|Understand} {Topic}"}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description Variables:</h4>
              <div className="space-y-1 font-mono text-xs bg-muted p-3 rounded">
                <div>{"Welcome to {our channel|the channel}!"}</div>
                <div>{"Don't forget to {like|subscribe|share}"}</div>
                <div>{"Follow us on {Twitter|Instagram|Facebook}"}</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            The system will randomly choose one option from each {"{"} {"}"} group when creating videos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}