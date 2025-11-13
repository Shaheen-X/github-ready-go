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
        .select(`
          *,
          activity:activities!messages_group_id_fkey(title, sport_type)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationsMap = new Map<string, Conversation>();
      
      data?.forEach((msg) => {
        const convId = msg.group_id || `dm-${msg.sender_id}-${msg.receiver_id}`;
        
        if (!conversationsMap.has(convId)) {
          const activity = Array.isArray(msg.activity) ? msg.activity[0] : msg.activity;
          
          conversationsMap.set(convId, {
            eventId: convId,
            title: activity?.title || msg.group_id ? 'Group Chat' : 'Direct Message',
            lastMessage: msg.content || '',
            time: new Date(msg.timestamp || new Date()).toLocaleTimeString(),
            unreadCount: 0,
            sharedImages: [],
            sharedFiles: [],
            activity: activity?.sport_type,
          });
        }
      });

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
          timestamp: msg.timestamp || new Date().toISOString(),
          isOwn: msg.sender_id === user.id,
        }));
      },
      enabled: !!eventId,
    });
  };

  // Send message
  const sendMessage = useMutation({
    mutationFn: async ({ eventId, text, replyToId }: { eventId: string; text: string; replyToId?: string }) => {
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
          reply_to: replyToId || null,
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

  // Placeholder functions for chat features (to be implemented)
  const deleteConversation = (eventId: string) => {
    console.log('Delete conversation:', eventId);
    // TODO: Implement conversation deletion
  };

  const toggleReaction = ({ messageId, reactionType, eventId }: { messageId: string; reactionType: string; eventId: string }) => {
    console.log('Toggle reaction:', { messageId, reactionType, eventId });
    // TODO: Implement reaction toggling
  };

  const deleteMessage = ({ messageId, eventId }: { messageId: string; eventId: string }) => {
    console.log('Delete message:', { messageId, eventId });
    // TODO: Implement message deletion
  };

  const togglePinMessage = ({ messageId, eventId, isPinned }: { messageId: string; eventId: string; isPinned: boolean }) => {
    console.log('Toggle pin message:', { messageId, eventId, isPinned });
    // TODO: Implement message pinning
  };

  return {
    conversations,
    useConversationMessages,
    sendMessage: sendMessage.mutate,
    deleteConversation,
    toggleReaction,
    deleteMessage,
    togglePinMessage,
  };
}
