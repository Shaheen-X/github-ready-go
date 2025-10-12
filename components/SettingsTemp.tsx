import { useState } from 'react';
import { 
  ChevronRight, 
  User, 
  Shield, 
  LogOut, 
  MapPin, 
  Camera, 
  Lock, 
  Eye, 
  Smartphone,
  Mail,
  Download,
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SettingsData {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    location: string;
    isPrivate: boolean;
  };
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    newActivities: boolean;
    activityReminders: boolean;
    messages: boolean;
    connections: boolean;
    achievements: boolean;
    weeklyDigest: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    showProfile: 'everyone' | 'connections' | 'nobody';
    showActivities: 'everyone' | 'connections' | 'nobody';
    showLocation: boolean;
    allowMessages: 'everyone' | 'connections' | 'nobody';
    showOnlineStatus: boolean;
    dataSharing: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    autoJoinDistance: number;
    defaultPrivacy: 'public' | 'private';
  };
}

const mockSettings: SettingsData = {
  profile: {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Adventure enthusiast who loves connecting with like-minded people.",
    location: "San Francisco, CA",
    isPrivate: false
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    newActivities: true,
    activityReminders: true,
    messages: true,
    connections: true,
    achievements: true,
    weeklyDigest: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00"
    }
  },
  privacy: {
    showProfile: 'everyone',
    showActivities: 'connections',
    showLocation: true,
    allowMessages: 'everyone',
    showOnlineStatus: true,
    dataSharing: false
  },
  preferences: {
    theme: 'auto',
    language: 'English',
    soundEnabled: true,
    hapticEnabled: true,
    autoJoinDistance: 5,
    defaultPrivacy: 'public'
  }
};

interface SettingsProps {
  onNavigate?: (tab: string) => void;
  onSignOut?: () => void;
}

export function Settings({ onNavigate, onSignOut }: SettingsProps = { onNavigate: () => {} }) {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateSetting = (category: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };


  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => onNavigate?.('profile')}
            >
              <ChevronRight size={16} className="rotate-180" />
            </Button>
            <h1 className="text-section-header">Settings</h1>
          </div>
          <Button variant="outline" size="sm" className="choice-chip">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-full p-1 shadow-lg mb-6">
            <TabsTrigger 
              value="account" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'account' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'privacy' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Privacy
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'preferences' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              App
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            {/* Profile Section */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={settings.profile.avatar} alt={settings.profile.name} />
                      <AvatarFallback>{settings.profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white p-0 hover:bg-blue-600">
                      <Camera size={12} />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-body font-medium">{settings.profile.name}</h3>
                    <p className="text-subtext">Tap to change profile photo</p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                    className="bg-white/50"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Input 
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    className="bg-white/50"
                    placeholder="Tell others about yourself..."
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <Input 
                      value={settings.profile.location}
                      onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-body font-medium">Contact Information</h4>
                  
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-500" />
                      <Input 
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-blue-500" />
                      <Input 
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                        className="bg-white/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} className="text-blue-500" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between choice-chip">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Change Password
                  </div>
                  <ChevronRight size={16} />
                </Button>

                <Button variant="outline" className="w-full justify-between choice-chip">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} />
                    Two-Factor Authentication
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Enabled</Badge>
                    <ChevronRight size={16} />
                  </div>
                </Button>

                <Button variant="outline" className="w-full justify-between choice-chip">
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    Login Activity
                  </div>
                  <ChevronRight size={16} />
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="glass-card border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={18} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    These actions cannot be undone. Please proceed with caution.
                  </AlertDescription>
                </Alert>

                <Button variant="outline" className="w-full justify-between border-red-200 text-red-600 hover:bg-red-50">
                  <div className="flex items-center gap-2">
                    <Download size={16} />
                    Download My Data
                  </div>
                  <ChevronRight size={16} />
                </Button>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-between border-red-200 text-red-600 hover:bg-red-50">
                      <div className="flex items-center gap-2">
                        <Trash2 size={16} />
                        Delete Account
                      </div>
                      <ChevronRight size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                      <DialogDescription>
                        This will permanently delete your ConnectSphere account and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  className="w-full justify-between border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={onSignOut}
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    Sign Out
                  </div>
                  <ChevronRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add the rest of the tabs content here for completeness */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-center h-64">
              <p className="text-subtext">Notification settings would go here</p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="flex items-center justify-center h-64">
              <p className="text-subtext">Privacy settings would go here</p>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="flex items-center justify-center h-64">
              <p className="text-subtext">Preference settings would go here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}