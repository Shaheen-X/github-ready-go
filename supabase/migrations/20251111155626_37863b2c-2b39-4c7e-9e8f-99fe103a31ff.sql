-- Create message reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id text NOT NULL,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Enable Row Level Security
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for message reactions
CREATE POLICY "Users can view reactions on their messages"
ON public.message_reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.messages
    WHERE messages.message_id = message_reactions.message_id
    AND (messages.sender_id = auth.uid() OR messages.receiver_id = auth.uid())
  )
);

CREATE POLICY "Users can add reactions"
ON public.message_reactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
ON public.message_reactions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);