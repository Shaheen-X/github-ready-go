import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Activity {
  id: number;
  title: string;
  type: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  price: string;
  host: {
    name: string;
    avatar: string;
  };
  status: 'upcoming' | 'joined' | 'hosted';
}

const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Weekend Basketball Game",
    type: "Sports",
    description: "Friendly basketball game at the local court. All skill levels welcome!",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    location: "Downtown Sports Center",
    date: "2025-09-28",
    time: "10:00 AM",
    participants: 8,
    maxParticipants: 10,
    price: "Free",
    host: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    status: "upcoming"
  },
  {
    id: 2,
    title: "Photography Walk",
    type: "Creative",
    description: "Explore the city through your lens. Capture beautiful moments and learn new techniques.",
    image: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=400&h=300&fit=crop",
    location: "Historic District",
    date: "2025-09-25",
    time: "2:00 PM",
    participants: 6,
    maxParticipants: 8,
    price: "$15",
    host: {
      name: "Sarah Kim",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6e1?w=150&h=150&fit=crop&crop=face"
    },
    status: "joined"
  },
  {
    id: 3,
    title: "Coding Bootcamp Workshop",
    type: "Tech",
    description: "Learn the basics of web development in this hands-on workshop. Laptops provided.",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
    location: "Tech Hub Co-working",
    date: "2025-09-30",
    time: "6:00 PM",
    participants: 12,
    maxParticipants: 15,
    price: "$25",
    host: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    status: "hosted"
  }
];

export function Activities() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredActivities = mockActivities.filter(activity => {
    if (activeTab === 'all') return true;
    if (activeTab === 'joined') return activity.status === 'joined';
    if (activeTab === 'hosted') return activity.status === 'hosted';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-full bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#D4C4A8] p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[0.75rem] font-normal text-[#5C5C5C]">
            Activities
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="w-[28px] h-[28px] rounded-lg bg-white border border-[#D4C4A8] text-[#D4C4A8]" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
              <Filter size={16} />
            </Button>
            <Button size="icon" className="w-[28px] h-[28px] rounded-lg bg-white border border-[#D4C4A8] text-[#D4C4A8]" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-[#D4C4A8] rounded-lg">
            <TabsTrigger value="all" className="text-[#D4C4A8] data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-white" style={{ fontSize: '0.5rem' }}>All</TabsTrigger>
            <TabsTrigger value="joined" className="text-[#D4C4A8] data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-white" style={{ fontSize: '0.5rem' }}>Joined</TabsTrigger>
            <TabsTrigger value="hosted" className="text-[#D4C4A8] data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-white" style={{ fontSize: '0.5rem' }}>Hosted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 relative">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-gray-800 text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
                    {activity.status === 'hosted' && (
                      <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                        Host
                      </Badge>
                    )}
                    {activity.status === 'joined' && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Joined
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>

                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{formatDate(activity.date)} at {activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{activity.participants}/{activity.maxParticipants} joined</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageWithFallback
                        src={activity.host.avatar}
                        alt={activity.host.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-600">{activity.host.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-indigo-600">{activity.price}</span>
                      {activity.status === 'upcoming' && (
                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-xs px-3 py-1">
                          Join
                        </Button>
                      )}
                      {activity.status === 'joined' && (
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          View
                        </Button>
                      )}
                      {activity.status === 'hosted' && (
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-4">Start by creating your first activity!</p>
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white">
              <Plus size={16} className="mr-2" />
              Create Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}