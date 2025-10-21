import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Users, Calendar, Trophy, Zap, MessageCircle, UserPlus } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
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
  mutualConnections: number;
  isConnected: boolean;
}

// Mock profile data - In production, this would come from a database based on userId
const getMockProfile = (userId: string): ProfileData => {
  const profiles: Record<string, ProfileData> = {
    'sarah-johnson': {
      id: 'sarah-johnson',
      name: 'Sarah Johnson',
      username: '@sarahjohnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c9c5?w=300&h=300&fit=crop&crop=face',
      level: 10,
      bio: 'Coffee lover ☕ and yoga enthusiast 🧘‍♀️. Always looking for new hiking trails and interesting people to connect with!',
      location: 'San Francisco, CA',
      joinedDate: 'March 2024',
      stats: {
        activitiesJoined: 32,
        activitiesHosted: 8,
        connections: 89,
        rating: 4.9,
        streakDays: 15,
        totalHours: 98
      },
      interests: ['Yoga', 'Hiking', 'Coffee', 'Photography', 'Reading'],
      achievements: [
        {
          id: 'early-bird',
          title: 'Early Bird',
          description: 'Joined 50+ morning activities',
          icon: '🌅',
          rarity: 'rare'
        },
        {
          id: 'social',
          title: 'Social Butterfly',
          description: 'Connected with 50+ people',
          icon: '🦋',
          rarity: 'epic'
        }
      ],
      recentActivities: [
        {
          id: 1,
          title: 'Morning Yoga Session',
          type: 'Wellness',
          date: '3 days ago',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop',
          attendees: 6,
          rating: 5.0
        },
        {
          id: 2,
          title: 'Coffee & Chat',
          type: 'Social',
          date: '1 week ago',
          image: 'https://images.unsplash.com/photo-1672094272561-3d4e3685a3fa?w=150&h=150&fit=crop',
          attendees: 4,
          rating: 4.8
        }
      ],
      mutualConnections: 12,
      isConnected: false
    },
    // Default profile for any other userId
    default: {
      id: userId,
      name: userId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      username: `@${userId}`,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      level: 8,
      bio: 'Activity enthusiast who loves connecting with people and exploring new experiences!',
      location: 'San Francisco, CA',
      joinedDate: 'April 2024',
      stats: {
        activitiesJoined: 24,
        activitiesHosted: 6,
        connections: 54,
        rating: 4.7,
        streakDays: 10,
        totalHours: 72
      },
      interests: ['Sports', 'Music', 'Food', 'Travel'],
      achievements: [
        {
          id: 'starter',
          title: 'Getting Started',
          description: 'Joined first activity',
          icon: '🎯',
          rarity: 'common'
        }
      ],
      recentActivities: [
        {
          id: 1,
          title: 'Group Fitness',
          type: 'Fitness',
          date: '5 days ago',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
          attendees: 10,
          rating: 4.6
        }
      ],
      mutualConnections: 8,
      isConnected: false
    }
  };

  return profiles[userId] || profiles.default;
};

const rarityColors = {
  common: 'bg-gray-100 border-gray-300',
  rare: 'bg-blue-100 border-blue-300',
  epic: 'bg-purple-100 border-purple-300',
  legendary: 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300'
};

export function ProfileViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const profile = getMockProfile(userId || '');

  const handleConnect = () => {
    toast.success('Connection request sent!', {
      description: `We'll notify you when ${profile.name} accepts your request`
    });
  };

  const handleMessage = () => {
    navigate('/messages');
    toast.info('Opening messages...');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-section-header">Profile</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="glass-card p-6 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-400/5"></div>
          
          <div className="relative z-10">
            {/* Avatar with Level Ring */}
            <div className="relative mx-auto w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-section-header">{profile.name}</h2>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0">
                Level {profile.level}
              </Badge>
            </div>

            <div className="text-body text-blue-600 mb-2">{profile.username}</div>

            <div className="flex items-center justify-center gap-1 text-body mb-4">
              <MapPin size={16} className="text-blue-500" />
              <span>{profile.location}</span>
            </div>

            <p className="text-body leading-relaxed mb-4">{profile.bio}</p>

            {/* Mutual Connections */}
            {profile.mutualConnections > 0 && (
              <div className="flex items-center justify-center gap-1 text-subtext mb-4">
                <Users size={14} />
                <span>{profile.mutualConnections} mutual connections</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {profile.isConnected ? (
                <Button 
                  variant="outline" 
                  className="choice-chip"
                  onClick={handleMessage}
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </Button>
              ) : (
                <Button 
                  className="choice-chip bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 hover:shadow-xl"
                  onClick={handleConnect}
                >
                  <UserPlus size={16} className="mr-2" />
                  Connect
                </Button>
              )}
              <Button 
                variant="outline" 
                className="choice-chip"
                onClick={handleMessage}
              >
                <MessageCircle size={16} className="mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="glass-card p-3 text-center">
            <div className="text-xl gradient-text mb-1">{profile.stats.activitiesJoined}</div>
            <div className="text-subtext text-xs">Activities Joined</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-xl gradient-text mb-1">{profile.stats.activitiesHosted}</div>
            <div className="text-subtext text-xs">Activities Hosted</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-xl gradient-text mb-1">{profile.stats.connections}</div>
            <div className="text-subtext text-xs">Connections</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xl gradient-text mb-1">
              <Star size={18} className="fill-current" />
              {profile.stats.rating}
            </div>
            <div className="text-subtext text-xs">Rating</div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="glass-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xl text-orange-500 mb-1">
              <Zap size={18} />
              {profile.stats.streakDays}
            </div>
            <div className="text-subtext text-xs">Day Streak</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-xl text-green-500 mb-1">{profile.stats.totalHours}h</div>
            <div className="text-subtext text-xs">Total Hours</div>
          </Card>
        </div>

        {/* Interests */}
        <Card className="glass-card p-4">
          <h3 className="text-section-header mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} className="choice-chip bg-white hover:bg-blue-50 text-gray-700 border border-gray-200">
                {interest}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="glass-card p-4">
          <h3 className="text-section-header mb-3 flex items-center">
            <Trophy size={18} className="mr-2 text-blue-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {profile.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-xl border-2 ${rarityColors[achievement.rarity]} text-center`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="text-body font-semibold mb-1">{achievement.title}</div>
                <div className="text-subtext text-xs">{achievement.description}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="glass-card p-4">
          <h3 className="text-section-header mb-3 flex items-center">
            <Calendar size={18} className="mr-2 text-blue-500" />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {profile.recentActivities.map((activity) => (
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
                  </div>
                </div>
                {activity.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} className="fill-current" />
                    <span className="text-subtext font-medium">{activity.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
