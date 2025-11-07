-- Create activity_participants table to track who joins activities
CREATE TABLE IF NOT EXISTS public.activity_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'declined')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(activity_id, user_id)
);

-- Enable RLS
ALTER TABLE public.activity_participants ENABLE ROW LEVEL SECURITY;

-- Policies for activity_participants
CREATE POLICY "Anyone can view participants of public activities"
  ON public.activity_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.activity_id = activity_participants.activity_id 
      AND activities.is_public = true
    )
  );

CREATE POLICY "Users can join activities"
  ON public.activity_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
  ON public.activity_participants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave activities"
  ON public.activity_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Add location_name field to activities for simple location display
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS location_name TEXT;

-- Enable realtime for participants
ALTER TABLE activity_participants REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_participants;