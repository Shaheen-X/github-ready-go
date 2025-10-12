import { useMemo, useState } from 'react';
import { Search as SearchIcon, MapPin, UserPlus, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Person {
  id: number;
  name: string;
  location: string;
  avatar: string;
  interests: string[];
  mutualCount: number;
  available: string;
}

const PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Sarah Martinez',
    location: 'San Francisco, CA',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b9c62e38?w=200&h=200&fit=crop&crop=face',
    interests: ['Yoga', 'Running', 'Pilates'],
    mutualCount: 4,
    available: 'Evenings this week',
  },
  {
    id: 2,
    name: 'Jason Lee',
    location: 'San Jose, CA',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    interests: ['Basketball', 'Gym', 'Cycling'],
    mutualCount: 2,
    available: 'Weekend mornings',
  },
  {
    id: 3,
    name: 'Emma Chen',
    location: 'Oakland, CA',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    interests: ['Tennis', 'Yoga', 'Hiking'],
    mutualCount: 5,
    available: 'Weekday afternoons',
  },
  {
    id: 4,
    name: 'Liam Patel',
    location: 'Palo Alto, CA',
    avatar:
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face',
    interests: ['Running', 'Climbing', 'Cycling'],
    mutualCount: 1,
    available: 'Flexible',
  },
];

const INTERESTS = ['All', 'Yoga', 'Running', 'Basketball', 'Tennis', 'Cycling', 'Gym', 'Hiking'];

export function OneToOneConnections() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    const byQuery = PEOPLE.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (filter === 'All') return byQuery;
    return byQuery.filter((p) => p.interests.includes(filter));
  }, [query, filter]);

  const handleConnect = (person: Person) => {
    toast.success('Connection request sent', {
      description: `You sent a request to ${person.name}`,
    });
  };

  const handleMessage = (person: Person) => {
    toast.info('Start a message', {
      description: `Say hello to ${person.name}`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-slate-800">One-to-One Connections</h1>
          <Sparkles className="text-blue-500" size={20} />
        </div>
        <p className="text-sm text-slate-500">Find people with shared interests and connect directly.</p>

        {/* Search */}
        <div className="relative mt-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            className="pl-9 bg-white/80 border-gray-200 rounded-xl"
          />
        </div>

        {/* Interests chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {INTERESTS.map((i) => (
            <button
              key={i}
              onClick={() => setFilter(i)}
              className={`choice-chip ${filter === i ? 'selected' : ''}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* People grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="glass-card border-white/30">
              <CardHeader className="pb-0">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <ImageWithFallback
                      src={p.avatar}
                      alt={p.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-slate-800 line-clamp-1">{p.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-slate-500">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{p.location}</span>
                    </CardDescription>
                  </div>
                  <CardAction>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full">
                      {p.mutualCount} mutual
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>

              <CardContent className="pt-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.interests.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-white/70 text-slate-700 border-gray-200 rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleConnect(p)} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl">
                    <UserPlus size={16} /> Connect
                  </Button>
                  <Button variant="outline" onClick={() => handleMessage(p)} className="rounded-xl">
                    <MessageCircle size={16} /> Message
                  </Button>
                  <div className="ml-auto text-xs text-slate-500 self-center">{p.available}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OneToOneConnections;
