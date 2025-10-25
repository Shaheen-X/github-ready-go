import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['search-activities', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('scheduled_datetime', { ascending: true });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,sport_type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });

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
              <div key={activity.activity_id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {activity.sport_type?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{activity.title || 'Untitled Activity'}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description || 'No description'} • {activity.scheduled_datetime ? new Date(activity.scheduled_datetime).toLocaleDateString() : 'Date TBD'}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {activity.sport_type && (
                        <Badge variant="activity">{activity.sport_type}</Badge>
                      )}
                      {activity.is_group_activity && (
                        <Badge variant="activity">Group</Badge>
                      )}
                      {activity.capacity && (
                        <Badge variant="outline">{activity.capacity} spots</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
