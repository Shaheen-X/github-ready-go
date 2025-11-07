import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useActivityParticipants() {
  const queryClient = useQueryClient();

  // Join activity
  const joinActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('activity_participants')
        .insert({
          activity_id: activityId,
          user_id: user.id,
          status: 'accepted',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Successfully joined activity!');
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate')) {
        toast.error('You already joined this activity');
      } else {
        toast.error('Failed to join activity', {
          description: error.message,
        });
      }
    },
  });

  // Leave activity
  const leaveActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('activity_participants')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Left activity');
    },
    onError: (error: any) => {
      toast.error('Failed to leave activity', {
        description: error.message,
      });
    },
  });

  return {
    joinActivity: joinActivity.mutate,
    leaveActivity: leaveActivity.mutate,
    isJoining: joinActivity.isPending,
    isLeaving: leaveActivity.isPending,
  };
}
