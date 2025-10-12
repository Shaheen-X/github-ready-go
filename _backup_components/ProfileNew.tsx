import { useState } from 'react';
import { Settings, Edit3, Share, Trophy, Users, Calendar, MapPin, Star, Award, Target, Zap, Camera, ChevronRight, MoreVertical, QrCode, Copy, User, Check, Plus, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  bio: string;
  location: string;
  joinedDate: string;
  stats: {
    activitiesJoined: number;
    activitiesHosted: number;
    connections: number;
    rating: number;
    streakDays: number;
    totalHours: number;
  };
  interests: string[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  recentActivities: {
    id: number;
    title: string;
    type: string;
    date: string;
    image: string;
    attendees: number;
    rating?: number;
  }[];
  connections: {
    id: string;
    name: string;
    avatar: string;
    mutualConnections?: number;
  }[];
}

const mockProfile: ProfileData = {
  id: "user-001",
  name: "Alex Morgan",
  username: "@alexmorgan",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  level: 12,
  xp: 2450,
  nextLevelXp: 3000,
  bio: "Adventure enthusiast who loves connecting with like-minded people. Always up for trying new activities and exploring new places! 🌟",
  location: "San Francisco, CA",
  joinedDate: "January 2024",
  stats: {
    activitiesJoined: 47,
    activitiesHosted: 12,
    connections: 156,
    rating: 4.8,
    streakDays: 23,
    totalHours: 156
  },
  interests: ["Hiking", "Yoga", "Photography", "Cooking", "Networking", "Art", "Rock Climbing", "Coffee"],
  achievements: [
    {
      id: "social-butterfly",
      title: "Social Butterfly",
      description: "Connected with 100+ people",
      icon: "🦋",
      unlockedAt: "2 weeks ago",
      rarity: "rare"
    },
    {
      id: "activity-host",
      title: "Event Master",
      description: "Hosted 10+ successful activities",
      icon: "🎯",
      unlockedAt: "1 month ago",
      rarity: "epic"
    },
    {
      id: "streak-master",
      title: "Consistency King",
      description: "20+ day activity streak",
      icon: "🔥",
      unlockedAt: "3 days ago",
      rarity: "legendary"
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Tried 15+ different activity types",
      icon: "🗺️",
      unlockedAt: "1 week ago",
      rarity: "common"
    }
  ],
  recentActivities: [
    {
      id: 1,
      title: "Mountain Hiking Adventure",
      type: "Outdoor",
      date: "2 days ago",
      image: "https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=150&h=150&fit=crop",
      attendees: 8,
      rating: 4.9
    },
    {
      id: 2,
      title: "Coffee & Networking",
      type: "Business",
      date: "1 week ago",
      image: "https://images.unsplash.com/photo-1672094272561-3d4e3685a3fa?w=150&h=150&fit=crop",
      attendees: 12,
      rating: 4.7
    },
    {
      id: 3,
      title: "Art Workshop Session",
      type: "Creative",
      date: "2 weeks ago",
      image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?w=150&h=150&fit=crop",
      attendees: 6,
      rating: 4.8
    }
  ],
  connections: [
    {
      id: "conn-1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c9c5?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 12
    },
    {
      id: "conn-2", 
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 8
    },
    {
      id: "conn-3",
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 15
    }
  ]
};

interface ProfileProps {
  onNavigate?: (tab: string) => void;
}

export function ProfileNew({ onNavigate }: ProfileProps = { onNavigate: () => {} }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showInterestsEdit, setShowInterestsEdit] = useState(false);
  const [profileData, setProfileData] = useState(mockProfile);
  const xpProgress = (profileData.xp / profileData.nextLevelXp) * 100;

  const copyQRCode = () => {
    const qrCodeUrl = `https://connectsphere.app/user/${profileData.username}`;
    navigator.clipboard.writeText(qrCodeUrl);
    toast.success('QR code link copied to clipboard!');
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(profileData.username);
    toast.success('Username copied to clipboard!');
  };

  const handleSaveProfile = (updatedData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updatedData }));
    setShowEditDialog(false);
    toast.success('Profile updated successfully!');
  };

  const updateInterests = (newInterests: string[]) => {
    setProfileData(prev => ({ ...prev, interests: newInterests }));
    toast.success('Interests updated successfully!');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400';
      case 'epic': return 'border-purple-400';
      case 'rare': return 'border-blue-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-section-header">Profile</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="choice-chip"
            onClick={() => onNavigate?.('settings')}
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="glass-card p-6 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-400/5"></div>
          
          <div className="relative z-10">
            {/* Avatar with XP Ring */}
            <div className="relative mx-auto w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={mockProfile.avatar} alt={mockProfile.name} />
                    <AvatarFallback>{mockProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 p-0"
              >
                <Camera size={14} />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-section-header">{profileData.name}</h2>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
                Level {profileData.level}
              </Badge>
            </div>

            {/* Username */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-body text-blue-600">{profileData.username}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={copyUsername}
              >
                <Copy size={12} className="text-blue-500" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1 text-body mb-4">
              <MapPin size={16} className="text-blue-500" />
              <span>{profileData.location}</span>
            </div>

            {/* XP Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-subtext mb-2">
                <span>{profileData.xp} XP</span>
                <span>{profileData.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="progress-gradient h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-subtext">
                {profileData.nextLevelXp - profileData.xp} XP to next level
              </p>
            </div>

            <p className="text-body leading-relaxed mb-4">{profileData.bio}</p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 hover:shadow-xl">
                    <Edit3 size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information including name, username, bio, and location.
                    </DialogDescription>
                  </DialogHeader>
                  <EditProfileForm 
                    profile={profileData} 
                    onSave={handleSaveProfile}
                    onCancel={() => setShowEditDialog(false)}
                  />
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="choice-chip"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode size={16} className="mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-full p-1 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'activities' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'achievements' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Awards
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className={`rounded-full text-button transition-all duration-200 ${
                activeTab === 'connections' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Network
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="glass-card p-3 text-center">
                <div className="text-xl gradient-text mb-1">{profileData.stats.activitiesJoined}</div>
                <div className="text-subtext text-xs">Activities Joined</div>
              </Card>
              <Card className="glass-card p-3 text-center">
                <div className="text-xl gradient-text mb-1">{profileData.stats.activitiesHosted}</div>
                <div className="text-subtext text-xs">Activities Hosted</div>
              </Card>
              <Card className="glass-card p-3 text-center">
                <div className="text-xl gradient-text mb-1">{profileData.stats.connections}</div>
                <div className="text-subtext text-xs">Connections</div>
              </Card>
              <Card className="glass-card p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xl gradient-text mb-1">
                  <Star size={18} className="fill-current" />
                  {profileData.stats.rating}
                </div>
                <div className="text-subtext text-xs">Rating</div>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="glass-card p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xl text-orange-500 mb-1">
                  <Zap size={18} />
                  {profileData.stats.streakDays}
                </div>
                <div className="text-subtext text-xs">Day Streak</div>
              </Card>
              <Card className="glass-card p-3 text-center">
                <div className="text-xl text-green-500 mb-1">{profileData.stats.totalHours}h</div>
                <div className="text-subtext text-xs">Total Hours</div>
              </Card>
            </div>

            {/* Interests */}
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-section-header flex items-center">
                  <Target size={18} className="mr-2 text-blue-500" />
                  Interests
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowInterestsEdit(!showInterestsEdit)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit3 size={14} />
                </Button>
              </div>
              
              {showInterestsEdit ? (
                <InterestsEditor 
                  interests={profileData.interests}
                  onSave={updateInterests}
                  onCancel={() => setShowInterestsEdit(false)}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge key={interest} className="choice-chip bg-white hover:bg-blue-50 text-gray-700 border border-gray-200">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4 mt-6">
            <Card className="glass-card p-4">
              <h3 className="text-section-header mb-3 flex items-center">
                <Calendar size={18} className="mr-2 text-blue-500" />
                Recent Activities
              </h3>
              <div className="space-y-3">
                {profileData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                    <ImageWithFallback
                      src={activity.image}
                      alt={activity.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-body font-medium">{activity.title}</h4>
                      <div className="flex items-center space-x-2 text-subtext">
                        <Badge variant="secondary" className="text-tag">{activity.type}</Badge>
                        <span>{activity.date}</span>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{activity.attendees}</span>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span>{activity.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-6">
            <Card className="glass-card p-4">
              <h3 className="text-section-header mb-3 flex items-center">
                <Trophy size={18} className="mr-2 text-blue-500" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {profileData.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-xl border-0 bg-gradient-to-r ${getAchievementColor(achievement.rarity)} hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          {achievement.title}
                          <Badge className="text-tag bg-white/20 text-white border-white/30">
                            {achievement.rarity}
                          </Badge>
                        </h4>
                        <p className="text-white/80 text-sm">{achievement.description}</p>
                        <p className="text-white/70 text-xs mt-1">Unlocked {achievement.unlockedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-4 mt-6">
            <Card className="glass-card p-4">
              <h3 className="text-section-header mb-3 flex items-center">
                <Users size={18} className="mr-2 text-blue-500" />
                Recent Connections
              </h3>
              <div className="space-y-3">
                {profileData.connections.map((connection) => (
                  <div key={connection.id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-body font-medium">{connection.name}</h4>
                      {connection.mutualConnections && (
                        <p className="text-subtext">{connection.mutualConnections} mutual connections</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="choice-chip">
                      Message
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full choice-chip mt-4">
                View All Connections
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Member Since */}
        <div className="text-center text-subtext">
          ConnectSphere member since {profileData.joinedDate}
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile QR Code</DialogTitle>
            <DialogDescription>
              Share this QR code with others to let them easily connect with your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-48 h-48 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <QrCode size={120} className="mx-auto mb-2 text-blue-500" />
                <p className="text-subtext">{profileData.username}</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-body">Share your profile with others</p>
              <p className="text-subtext text-xs">connectsphere.app/user/{profileData.username.replace('@', '')}</p>
            </div>
            <Button onClick={copyQRCode} className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
              <Copy size={16} className="mr-2" />
              Copy QR Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Profile Form Component
interface EditProfileFormProps {
  profile: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
  onCancel: () => void;
}

function EditProfileForm({ profile, onSave, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    location: profile.location,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="bg-white/50"
          placeholder="@username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="bg-white/50 resize-none"
          rows={3}
          placeholder="Tell others about yourself..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="bg-white/50"
          placeholder="City, Country"
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="choice-chip">
          Cancel
        </Button>
        <Button type="submit" className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
          <Check size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// Helper function for achievement colors
function getAchievementColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'from-purple-500 to-pink-500';
    case 'epic':
      return 'from-indigo-500 to-purple-500';
    case 'rare':
      return 'from-blue-500 to-indigo-500';
    case 'uncommon':
      return 'from-green-500 to-blue-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
}

// Interests Editor Component
interface InterestsEditorProps {
  interests: string[];
  onSave: (interests: string[]) => void;
  onCancel: () => void;
}

function InterestsEditor({ interests, onSave, onCancel }: InterestsEditorProps) {
  const [editedInterests, setEditedInterests] = useState([...interests]);
  const [newInterest, setNewInterest] = useState('');

  const addInterest = () => {
    if (newInterest.trim() && editedInterests.length < 10 && !editedInterests.includes(newInterest.trim())) {
      setEditedInterests([...editedInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setEditedInterests(editedInterests.filter(i => i !== interest));
  };

  const handleSave = () => {
    onSave(editedInterests);
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {editedInterests.map((interest) => (
          <Badge 
            key={interest} 
            className="choice-chip bg-blue-50 text-blue-700 border-blue-200 cursor-pointer"
            onClick={() => removeInterest(interest)}
          >
            {interest}
            <X size={12} className="ml-1" />
          </Badge>
        ))}
      </div>
      
      {editedInterests.length < 10 && (
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add new interest..."
            className="bg-white/50"
            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addInterest}
            disabled={!newInterest.trim() || editedInterests.includes(newInterest.trim())}
            className="choice-chip"
          >
            <Plus size={16} />
          </Button>
        </div>
      )}
      
      <div className="text-subtext text-xs">
        {editedInterests.length}/10 interests
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} className="choice-chip">
          Cancel
        </Button>
        <Button onClick={handleSave} className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
          <Check size={16} className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}