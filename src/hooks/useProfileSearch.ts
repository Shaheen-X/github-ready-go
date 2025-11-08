import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
}

export function useProfileSearch(searchType: 'username' | 'email', searchValue: string) {
  return useQuery({
    queryKey: ['profile-search', searchType, searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return [];

      const { data: currentUser } = await supabase.auth.getUser();
      
      let query = supabase
        .from('profiles')
        .select('id, name, email, avatar_url, bio')
        .neq('id', currentUser.user?.id || ''); // Exclude current user

      if (searchType === 'username') {
        query = query.ilike('name', `%${searchValue}%`);
      } else {
        query = query.ilike('email', `%${searchValue}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      return data as Profile[];
    },
    enabled: searchValue.trim().length > 0,
  });
}
