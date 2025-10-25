import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

      // Group messages by conversation (using group_id or creating pairwise conversation)
      const conversationsMap = new Map<string, Conversation>();
      
      data?.forEach((msg) => {
        const convId = msg.group_id || `dm-${msg.sender_id}-${msg.receiver_id}`;
        
        if (!conversationsMap.has(convId)) {
          conversationsMap.set(convId, {
            eventId: convId,
            title: msg.group_id ? 'Group Chat' : 'Direct Message',
            lastMessage: msg.content || '',
            time: new Date(msg.timestamp || new Date()).toLocaleTimeString(),
            unreadCount: 0,
            sharedImages: [],
            sharedFiles: [],
          });
        }
      });

      return Array.from(conversationsMap.values());
    },
  });

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

  return {
    conversations,
    useConversationMessages,
    sendMessage: sendMessage.mutate,
  };
}
