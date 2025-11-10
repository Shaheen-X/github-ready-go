import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types/chat';
import { toast } from 'sonner';

export function useMessagesDB() {
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all messages where user is sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Group messages by conversation and fetch activity data
      const conversationsMap = new Map<string, Conversation>();
      const activityIds = new Set<string>();
      
      data?.forEach((msg) => {
        const convId = msg.group_id || `dm-${msg.sender_id}-${msg.receiver_id}`;
        
        if (!conversationsMap.has(convId)) {
          conversationsMap.set(convId, {
            eventId: convId,
            title: msg.group_id || 'Direct Message',
            lastMessage: msg.content || '',
            time: new Date(msg.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: 0,
            sharedImages: [],
            sharedFiles: [],
            activity: undefined,
          });
          
          if (msg.group_id) {
            activityIds.add(msg.group_id);
          }
        }
      });

      // Fetch activity details for all activity IDs
      if (activityIds.size > 0) {
        const { data: activities } = await supabase
          .from('activities')
          .select('activity_id, title, sport_type')
          .in('activity_id', Array.from(activityIds));

        activities?.forEach((activity) => {
          const conv = conversationsMap.get(activity.activity_id);
          if (conv) {
            conv.title = activity.title || 'Group Chat';
            conv.activity = activity.sport_type || undefined;
          }
        });
      }

      return Array.from(conversationsMap.values());
    },
  });

  // Set up real-time subscription for messages
  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Invalidate conversations and messages when any change occurs
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Fetch messages for a conversation
  const useConversationMessages = (eventId: string) => {
    return useQuery({
      queryKey: ['messages', eventId],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('group_id', eventId)
          .order('timestamp', { ascending: true });

        if (error) throw error;

        return (data || []).map((msg): Message => ({
          id: msg.message_id,
          sender: msg.sender_id || '',
          text: msg.content || '',
          time: new Date(msg.timestamp || new Date()).toLocaleTimeString(),
          isOwn: msg.sender_id === user.id,
        }));
      },
      enabled: !!eventId,
    });
  };

  // Send message
  const sendMessage = useMutation({
    mutationFn: async ({ eventId, text }: { eventId: string; text: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { error } = await supabase
        .from('messages')
        .insert({
          message_id: messageId,
          group_id: eventId,
          sender_id: user.id,
          content: text,
          message_type: 'text',
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error('Failed to send message', {
        description: error.message,
      });
    },
  });

  // Delete conversation
  const deleteConversation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete all messages in this conversation
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('group_id', eventId)
        .eq('sender_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Conversation deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete conversation', {
        description: error.message,
      });
    },
  });

  return {
    conversations,
    useConversationMessages,
    sendMessage: sendMessage.mutate,
    deleteConversation: deleteConversation.mutate,
  };
}
