import { useState } from 'react';
import { Search as SearchIcon, Calendar, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { SearchActivityModal } from '@/components/SearchActivityModal';

// Mock diverse test data with different times and repetition patterns
const mockActivities = [
  {
    activity_id: 'test-1',
    title: 'Morning Running Club',
    sport_type: 'Running',
    description: 'Start your day with an energizing run through the park. All paces welcome!',
    scheduled_datetime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    recurrence_pattern: 'Every Tuesday & Thursday',
    capacity: 8,
    is_group_activity: true,
    is_public: true,
    status: 'active',
    difficulty_level: 'Beginner',
    host_id: 'mock-host-1',
  },
  {
    activity_id: 'test-2',
    title: 'One-time Tennis Match',
    sport_type: 'Tennis',
    description: 'Looking for a tennis partner for a friendly match this weekend.',
    scheduled_datetime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    recurrence_pattern: undefined,
    capacity: 2,
    is_group_activity: false,
    is_public: true,
    status: 'active',
    difficulty_level: 'Intermediate',
    host_id: 'mock-host-2',
  },
  {
    activity_id: 'test-3',
    title: 'Weekly Yoga Sessions',
    sport_type: 'Yoga',
    description: 'Join our peaceful yoga sessions to improve flexibility and mindfulness.',
    scheduled_datetime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    recurrence_pattern: 'Every Monday at 6 PM',
    capacity: 15,
    is_group_activity: true,
    is_public: true,
    status: 'active',
    difficulty_level: 'All Levels',
    host_id: 'mock-host-3',
  },
  {
    activity_id: 'test-4',
    title: 'Basketball Pickup Game',
    sport_type: 'Basketball',
    description: 'Casual pickup basketball game. Bring your energy and good vibes!',
    scheduled_datetime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    recurrence_pattern: 'Saturdays at 10 AM',
    capacity: 10,
    is_group_activity: true,
    is_public: true,
    status: 'active',
    difficulty_level: 'Intermediate',
    host_id: 'mock-host-4',
  },
  {
    activity_id: 'test-5',
    title: 'Evening Chess Club',
    sport_type: 'Chess',
    description: 'Sharpen your chess skills in a friendly and competitive environment.',
    scheduled_datetime: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    recurrence_pattern: 'Daily at 7 PM',
    capacity: 12,
    is_group_activity: true,
    is_public: true,
    status: 'active',
    difficulty_level: 'Advanced',
    host_id: 'mock-host-5',
  },
];

// Mock host profiles
const mockHosts = {
  'mock-host-1': { name: 'Sarah Johnson', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', location: 'Central Park, NY' },
  'mock-host-2': { name: 'Mike Chen', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', location: 'Tennis Courts, LA' },
  'mock-host-3': { name: 'Emma Wilson', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', location: 'Yoga Studio, SF' },
  'mock-host-4': { name: 'David Brown', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', location: 'Community Court, Chicago' },
  'mock-host-5': { name: 'Lisa Anderson', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', location: 'Chess Cafe, Seattle' },
};

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['search-activities', searchQuery],
    queryFn: async () => {
      // Use mock data for testing
      let results = mockActivities;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = mockActivities.filter(activity => 
          activity.title.toLowerCase().includes(query) ||
          activity.sport_type.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query)
        );
      }

      return results;
    },
    enabled: true,
  });

  const handleCardClick = (activity: any) => {
    const host = mockHosts[activity.host_id as keyof typeof mockHosts];
    setSelectedActivity({
      ...activity,
      host,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Discover Activities</h1>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for activities, people, or locations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? 'No activities found. Try a different search term.' : 'No activities available yet.'}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.activity_id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleCardClick(activity)}
                  >
                    {activity.sport_type?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleCardClick(activity)}
                    >
                      {activity.title || 'Untitled Activity'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description?.substring(0, 60)}... • {activity.scheduled_datetime ? new Date(activity.scheduled_datetime).toLocaleDateString() : 'Date TBD'}
                    </p>
                    <div className="flex gap-2 flex-wrap items-center mb-3">
                      {activity.sport_type && (
                        <Badge variant="activity">{activity.sport_type}</Badge>
                      )}
                      {activity.is_group_activity && (
                        <Badge variant="activity">Group</Badge>
                      )}
                      {activity.capacity && (
                        <Badge variant="outline">{activity.capacity} spots</Badge>
                      )}
                      {activity.recurrence_pattern && (
                        <Badge variant="outline">{activity.recurrence_pattern}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-md transition-all">
                        <Calendar className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCardClick(activity)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SearchActivityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  );
}
