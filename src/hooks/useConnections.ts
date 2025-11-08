import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface ConnectionWithProfile extends Connection {
  requester_profile?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  receiver_profile?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

export function useConnections() {
  const queryClient = useQueryClient();

  // Fetch all connections for current user
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;
      if (!connectionsData) return [];

      // Get unique user IDs
      const userIds = new Set<string>();
      connectionsData.forEach((conn) => {
        userIds.add(conn.requester_id);
        userIds.add(conn.receiver_id);
      });

      // Fetch profiles for all users in connections
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Map profiles to connections
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      
      const result: ConnectionWithProfile[] = connectionsData.map((conn) => ({
        ...conn,
        requester_profile: profileMap.get(conn.requester_id),
        receiver_profile: profileMap.get(conn.receiver_id),
      }));

      return result;
    },
  });

  // Send connection request
  const sendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          receiver_id: receiverId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Connection request sent!');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('Connection request already exists');
      } else {
        toast.error('Failed to send connection request');
      }
    },
  });

  // Accept connection request
  const acceptRequest = useMutation({
    mutationFn: async (connectionId: string) => {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Connection request accepted!');
    },
    onError: () => {
      toast.error('Failed to accept connection request');
    },
  });

  // Reject connection request
  const rejectRequest = useMutation({
    mutationFn: async (connectionId: string) => {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Connection request rejected');
    },
    onError: () => {
      toast.error('Failed to reject connection request');
    },
  });

  // Cancel pending request
  const cancelRequest = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Connection request cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel connection request');
    },
  });

  // Check connection status with a specific user
  const getConnectionStatus = (userId: string): ConnectionStatus | null => {
    const connection = connections.find(
      (c) => c.requester_id === userId || c.receiver_id === userId
    );
    return connection?.status || null;
  };

  // Get pending requests received
  const getPendingRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    return connections.filter((c) => {
      return c.status === 'pending' && c.receiver_id === user.id;
    });
  };

  // Get accepted connections
  const acceptedConnections = connections.filter((c) => c.status === 'accepted');

  return {
    connections,
    isLoading,
    sendRequest: sendRequest.mutate,
    acceptRequest: acceptRequest.mutate,
    rejectRequest: rejectRequest.mutate,
    cancelRequest: cancelRequest.mutate,
    getConnectionStatus,
    getPendingRequests,
    acceptedConnections,
    isSending: sendRequest.isPending,
  };
}
