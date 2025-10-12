import { Settings, Edit3, Share, Trophy, Users, Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface ProfileData {
  name: string;
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
  };
  interests: string[];
  recentActivities: {
    id: number;
    title: string;
    type: string;
    date: string;
    image: string;
  }[];
}

const mockProfile: ProfileData = {
  name: "Alex Morgan",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  level: 12,
  xp: 2450,
  nextLevelXp: 3000,
  bio: "Adventure enthusiast who loves connecting with like-minded people. Always up for trying new activities and exploring new places!",
  location: "San Francisco, CA",
  joinedDate: "January 2024",
  stats: {
    activitiesJoined: 47,
    activitiesHosted: 12,
    connections: 156,
    rating: 4.8
  },
  interests: ["hiking", "yoga", "photography", "cooking", "networking", "art"],
  recentActivities: [
    {
      id: 1,
      title: "Mountain Hiking",
      type: "Outdoor",
      date: "2 days ago",
      image: "https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      title: "Coffee Networking",
      type: "Business",
      date: "1 week ago",
      image: "https://images.unsplash.com/photo-1672094272561-3d4e3685a3fa?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      title: "Art Workshop",
      type: "Creative",
      date: "2 weeks ago",
      image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?w=150&h=150&fit=crop"
    }
  ]
};

export function Profile() {
  const xpProgress = (mockProfile.xp / mockProfile.nextLevelXp) * 100;

  return (
    <div className="h-full bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#D4C4A8] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[0.75rem] font-normal text-[#5C5C5C]">
            Profile
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="w-[28px] h-[28px] rounded-lg bg-white border border-[#D4C4A8] text-[#D4C4A8]" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
              <Share size={16} />
            </Button>
            <Button variant="outline" size="icon" className="w-[28px] h-[28px] rounded-lg bg-white border border-[#D4C4A8] text-[#D4C4A8]" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <div 
          className="bg-white backdrop-blur-sm rounded-lg border border-[#D4C4A8] p-6 text-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0.5px 0.5px 1px #5C5C5C'
          }}
        >
          {/* Avatar with XP Ring */}
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#D4C4A8] p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                <ImageWithFallback
                  src={mockProfile.avatar}
                  alt={mockProfile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-[#D4C4A8] text-[#D4C4A8] px-3 py-1 rounded-lg" style={{ fontSize: '0.5rem', boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
              Level {mockProfile.level}
            </div>
          </div>

          <h2 className="text-[0.75rem] font-normal text-[#5C5C5C] mb-2">{mockProfile.name}</h2>
          <div className="flex items-center justify-center space-x-1 text-[#5C5C5C] mb-3">
            <MapPin size={12} style={{ color: '#D4C4A8' }} />
            <span style={{ fontSize: '0.5rem' }}>{mockProfile.location}</span>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-[#5C5C5C] mb-2" style={{ fontSize: '0.5rem' }}>
              <span>{mockProfile.xp} XP</span>
              <span>{mockProfile.nextLevelXp} XP</span>
            </div>
            <Progress value={xpProgress} className="h-1 bg-white border border-[#D4C4A8]" style={{ backgroundColor: '#D4C4A8' }} />
            <p className="text-[#D4C4A8] mt-1" style={{ fontSize: '0.5rem' }}>
              {mockProfile.nextLevelXp - mockProfile.xp} XP to next level
            </p>
          </div>

          <p className="text-[#5C5C5C] leading-relaxed mb-4" style={{ fontSize: '0.5rem' }}>{mockProfile.bio}</p>

          <Button className="w-full bg-white border border-[#D4C4A8] text-[#D4C4A8] rounded-lg hover:scale-1.01 active:scale-0.98 transition-all duration-50" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C', fontSize: '0.5rem' }}>
            <Edit3 size={12} className="mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{mockProfile.stats.activitiesJoined}</div>
            <div className="text-sm text-gray-600">Activities Joined</div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{mockProfile.stats.activitiesHosted}</div>
            <div className="text-sm text-gray-600">Activities Hosted</div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{mockProfile.stats.connections}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">★ {mockProfile.stats.rating}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Trophy size={18} className="mr-2 text-indigo-600" />
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockProfile.interests.map((interest) => (
              <Badge key={interest} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                #{interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Calendar size={18} className="mr-2 text-indigo-600" />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {mockProfile.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/30 rounded-xl">
                <ImageWithFallback
                  src={activity.image}
                  alt={activity.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Badge variant="secondary" className="text-xs">{activity.type}</Badge>
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Since */}
        <div className="text-center text-sm text-gray-500">
          Member since {mockProfile.joinedDate}
        </div>
      </div>
    </div>
  );
}