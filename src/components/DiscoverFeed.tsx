import { useState } from 'react';
import { Heart, Bookmark, MessageCircle, MapPin, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Activity {
  id: number;
  title: string;
  type: string;
  description: string;
  image: string;
  location: string;
  time: string;
  participants: number;
  maxParticipants: number;
  tags: string[];
  host: {
    name: string;
    avatar: string;
    rating: number;
  };
}

const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Mountain Hiking Adventure",
    type: "Outdoor",
    description: "Join us for an exciting hiking adventure through scenic mountain trails. Perfect for beginners and experienced hikers alike!",
    image: "https://images.unsplash.com/photo-1595368062405-e4d7840cba14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBoaWtpbmclMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzU4NTQyODAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Blue Ridge Mountains",
    time: "Tomorrow 8:00 AM",
    participants: 8,
    maxParticipants: 12,
    tags: ["hiking", "nature", "adventure"],
    host: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6e1?w=150&h=150&fit=crop&crop=face",
      rating: 4.8
    }
  },
  {
    id: 2,
    title: "Morning Yoga Session",
    type: "Wellness",
    description: "Start your day with peaceful yoga in the park. All levels welcome. Bring your own mat or rent one from us.",
    image: "https://images.unsplash.com/photo-1561579890-3ace74d8e378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZpdG5lc3MlMjB5b2dhfGVufDF8fHx8MTc1ODU0MjgwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Central Park",
    time: "Today 7:00 AM",
    participants: 15,
    maxParticipants: 20,
    tags: ["yoga", "wellness", "morning"],
    host: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.9
    }
  },
  {
    id: 3,
    title: "Creative Art Workshop",
    type: "Creative",
    description: "Explore your artistic side in this hands-on painting workshop. All materials provided. Great for beginners!",
    image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wfGVufDF8fHx8MTc1ODUyMDEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Art Studio Downtown",
    time: "Saturday 2:00 PM",
    participants: 6,
    maxParticipants: 10,
    tags: ["art", "creative", "workshop"],
    host: {
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
      rating: 4.7
    }
  }
];

export function DiscoverFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const currentActivity = mockActivities[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && !liked.includes(currentActivity.id)) {
      setLiked([...liked, currentActivity.id]);
    }
    
    setCurrentIndex((prev) => (prev + 1) % mockActivities.length);
  };

  const toggleBookmark = () => {
    if (bookmarked.includes(currentActivity.id)) {
      setBookmarked(bookmarked.filter(id => id !== currentActivity.id));
    } else {
      setBookmarked([...bookmarked, currentActivity.id]);
    }
  };

  const toggleLike = () => {
    if (liked.includes(currentActivity.id)) {
      setLiked(liked.filter(id => id !== currentActivity.id));
    } else {
      setLiked([...liked, currentActivity.id]);
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-900">
          Discover
        </h1>
        <p className="text-gray-500 mt-1">Find amazing activities near you</p>
      </div>

      {/* Activity Card */}
      <div className="absolute inset-x-4 top-24 bottom-32 flex items-center">
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
          {/* Image */}
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <ImageWithFallback
              src={currentActivity.image}
              alt={currentActivity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-white text-[#5C5C5C] border border-[#D4C4A8]" style={{ fontSize: '0.5rem' }}>
                {currentActivity.type}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
              <div className="flex items-center space-x-2 text-[#5C5C5C]">
                <ImageWithFallback
                  src={currentActivity.host.avatar}
                  alt={currentActivity.host.name}
                  className="w-8 h-8 rounded-full border border-[#D4C4A8]"
                />
                <span style={{ fontSize: '0.5rem' }}>{currentActivity.host.name}</span>
                <span style={{ fontSize: '0.5rem', color: '#D4C4A8' }}>★ {currentActivity.host.rating}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentActivity.title}</h2>
              <p className="text-gray-600 leading-relaxed">{currentActivity.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentActivity.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} className="text-blue-500" />
                <span>{currentActivity.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={16} className="text-blue-500" />
                <span>{currentActivity.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users size={16} className="text-blue-500" />
                <span>
                  {currentActivity.participants}/{currentActivity.maxParticipants} participants
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-16 left-0 right-0 px-6">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
            onClick={() => handleSwipe('left')}
          >
            ✕
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`w-14 h-14 rounded-full border-2 transition-all duration-300 ${
              bookmarked.includes(currentActivity.id) 
                ? 'bg-yellow-100 border-yellow-200 text-yellow-600' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200'
            }`}
            onClick={toggleBookmark}
          >
            <Bookmark size={20} fill={bookmarked.includes(currentActivity.id) ? 'currentColor' : 'none'} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
          >
            <MessageCircle size={20} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`w-14 h-14 rounded-full border-2 transition-all duration-300 ${
              liked.includes(currentActivity.id) 
                ? 'bg-red-100 border-red-200 text-red-600' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200'
            }`}
            onClick={toggleLike}
          >
            <Heart size={20} fill={liked.includes(currentActivity.id) ? 'currentColor' : 'none'} />
          </Button>

          <Button
            className="w-20 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 transition-all duration-300"
            onClick={() => handleSwipe('right')}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}