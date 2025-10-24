import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CalendarEvent } from '@/types/calendar';

export const useActivities = () => {
  const [activities, setActivities] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('scheduled_datetime', { ascending: true })
        .limit(20);

      if (error) throw error;

      // Transform activities to CalendarEvent format
      const transformedActivities: CalendarEvent[] = (data || []).map((activity) => {
        const scheduledDate = activity.scheduled_datetime 
          ? new Date(activity.scheduled_datetime)
          : new Date();
        
        // Handle tags - it's a Json type from Supabase
        let tags: string[] = [];
        if (activity.tags) {
          if (Array.isArray(activity.tags)) {
            tags = activity.tags.filter((tag): tag is string => typeof tag === 'string');
          }
        }
        
        return {
          id: activity.activity_id,
          title: activity.title || 'Untitled Activity',
          type: activity.is_group_activity ? 'group' : 'one-to-one',
          activity: activity.sport_type || 'Activity',
          date: scheduledDate,
          time: scheduledDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          location: activity.place_id || 'TBD',
          description: activity.description || '',
          attendees: [], // TODO: Fetch from participants table
          maxParticipants: activity.capacity || null,
          status: 'upcoming',
          tags: tags,
          hostId: activity.host_id || undefined,
          hostName: 'Activity Host', // TODO: Fetch from users table
          isHost: false,
        } as CalendarEvent;
      });

      setActivities(transformedActivities);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = () => {
    fetchActivities();
  };

  return {
    activities,
    loading,
    error,
    refreshActivities
  };
};
