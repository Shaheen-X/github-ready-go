import { useState } from 'react';
import { Plus, Users, MessageCircle, Settings, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from './Navbar';

interface Group {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
  unreadMessages: number;
  role: 'member' | 'admin' | 'owner' | null;
}

const mockGroups: Group[] = [
  {
    id: 1,
    name: "SF Hiking Enthusiasts",
    description: "Weekly hiking adventures around the Bay Area. All levels welcome!",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=400&h=300&fit=crop",
    memberCount: 234,
    isPrivate: false,
    lastActivity: "2 hours ago",
    unreadMessages: 3,
    role: "member"
  },
  {
    id: 2,
    name: "Creative Minds Collective",
    description: "Artists, designers, and creative professionals sharing ideas and collaborating.",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?w=400&h=300&fit=crop",
    memberCount: 89,
    isPrivate: false,
    lastActivity: "1 day ago",
    unreadMessages: 0,
    role: "admin"
  },
  {
    id: 3,
    name: "Morning Yoga Circle",
    description: "Start your day right with mindful yoga sessions and meditation.",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1561579890-3ace74d8e378?w=400&h=300&fit=crop",
    memberCount: 156,
    isPrivate: true,
    lastActivity: "3 hours ago",
    unreadMessages: 7,
    role: "member"
  },
  {
    id: 4,
    name: "Tech Networking Hub",
    description: "Connect with fellow tech professionals, share opportunities, and grow together.",
    category: "Professional",
    image: "https://images.unsplash.com/photo-1672094272561-3d4e3685a3fa?w=400&h=300&fit=crop",
    memberCount: 412,
    isPrivate: false,
    lastActivity: "5 minutes ago",
    unreadMessages: 12,
    role: "owner"
  }
];

const discoverGroups: Group[] = [
  {
    id: 5,
    name: "Photography Walks",
    description: "Explore the city through your camera lens with fellow photographers.",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=400&h=300&fit=crop",
    memberCount: 78,
    isPrivate: false,
    lastActivity: "1 hour ago",
    unreadMessages: 0,
    role: null
  },
  {
    id: 6,
    name: "Cooking Adventures",
    description: "Food lovers unite! Share recipes, cooking tips, and organize group cooking sessions.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    memberCount: 203,
    isPrivate: false,
    lastActivity: "30 minutes ago",
    unreadMessages: 0,
    role: null
  }
];

export function Groups() {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = (activeTab === 'my-groups' ? mockGroups : discoverGroups).filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-blue-100 text-blue-700';
      case 'member': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-section-header gradient-text">Groups</h1>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-input-background border border-white/20 rounded-xl backdrop-blur-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex glass-card border-white/20 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'my-groups'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Discover
          </button>
        </div>

        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div 
              key={group.id}
              className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-20 h-20 relative flex-shrink-0">
                  <ImageWithFallback
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover rounded-l-2xl"
                  />
                  {group.isPrivate && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {group.category}
                        </Badge>
                        {group.role && (
                          <Badge className={`text-xs ${getRoleColor(group.role)}`}>
                            {group.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {group.unreadMessages > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {group.unreadMessages > 9 ? '9+' : group.unreadMessages}
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{group.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{group.memberCount} members</span>
                      </div>
                      <span>Active {group.lastActivity}</span>
                    </div>

                    <div className="flex space-x-2">
                      {activeTab === 'my-groups' ? (
                        <>
                          <Button size="sm" variant="outline" className="text-xs px-3 py-1 rounded-full">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                          {(group.role === 'admin' || group.role === 'owner') && (
                            <Button size="sm" variant="outline" className="text-xs px-3 py-1 rounded-full">
                              <Settings className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-1 rounded-full">
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === 'my-groups' ? 'No groups joined yet' : 'No groups found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'my-groups' 
                ? 'Discover groups that match your interests!' 
                : 'Try adjusting your search or create a new group.'
              }
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'my-groups' ? 'Discover Groups' : 'Create Group'}
            </Button>
          </div>
        )}

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}