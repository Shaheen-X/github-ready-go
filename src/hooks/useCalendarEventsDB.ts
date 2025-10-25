import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, NewEventInput } from '@/types/calendar';
import { toast } from 'sonner';

export function useCalendarEventsDB() {
  const queryClient = useQueryClient();

  // Fetch all events for the current user
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch activities where user is host or participant
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('host_id', user.id)
        .order('scheduled_datetime', { ascending: true });

      if (error) throw error;

      // Transform database activities to CalendarEvent format
      return (data || []).map((activity): CalendarEvent => ({
        id: activity.activity_id,
        title: activity.title || '',
        type: activity.is_group_activity ? 'group' : 'one-to-one',
        activity: activity.sport_type || '',
        date: new Date(activity.scheduled_datetime || new Date()),
        time: new Date(activity.scheduled_datetime || new Date()).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        location: '', // We'll need to join with places table for this
        description: activity.description || '',
        attendees: [], // We'll need a separate participants table for this
        maxParticipants: activity.capacity || null,
        status: activity.status === 'active' ? 'upcoming' : 'cancelled',
        tags: activity.tags as string[] || [],
        isHost: true,
        hostId: activity.host_id || undefined,
      }));
    },
  });

  // Create new event
  const createEvent = useMutation({
    mutationFn: async (eventInput: NewEventInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase
        .from('activities')
        .insert({
          activity_id: activityId,
          title: eventInput.title,
          sport_type: eventInput.type,
          scheduled_datetime: eventInput.date.toISOString(),
          description: eventInput.description,
          host_id: user.id,
          capacity: eventInput.maxParticipants,
          status: 'active',
          is_public: true,
          is_group_activity: eventInput.type === 'group',
          tags: eventInput.tags as any,
          time_status: eventInput.timeStatus || 'confirmed',
          time_flexibility: eventInput.timeFlexibility,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Event created successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });

  // Update event
  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CalendarEvent> }) => {
      const { error } = await supabase
        .from('activities')
        .update({
          title: updates.title,
          description: updates.description,
          scheduled_datetime: updates.date?.toISOString(),
          status: updates.status === 'cancelled' ? 'cancelled' : 'active',
        })
        .eq('activity_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Event updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });

  // Delete event
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('activity_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Event deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete event', {
        description: error.message,
      });
    },
  });

  return {
    events,
    isLoading,
    createEvent: createEvent.mutate,
    updateEvent: updateEvent.mutate,
    deleteEvent: deleteEvent.mutate,
  };
}
