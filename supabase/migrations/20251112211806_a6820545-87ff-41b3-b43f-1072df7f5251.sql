-- Create pinned_messages table
CREATE TABLE IF NOT EXISTS public.pinned_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id TEXT NOT NULL,
  message_id TEXT NOT NULL REFERENCES public.messages(message_id) ON DELETE CASCADE,
  pinned_by_user_id UUID NOT NULL,
  pinned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, message_id)
);

-- Enable RLS
ALTER TABLE public.pinned_messages ENABLE ROW LEVEL SECURITY;

-- Policies for pinned messages
CREATE POLICY "Users can view pinned messages in their conversations"
ON public.pinned_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM messages m
    WHERE m.group_id = pinned_messages.group_id
    AND (m.sender_id = auth.uid() OR m.receiver_id = auth.uid())
  )
);

CREATE POLICY "Users can pin messages"
ON public.pinned_messages FOR INSERT
WITH CHECK (
  pinned_by_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM messages m
    WHERE m.group_id = pinned_messages.group_id
    AND (m.sender_id = auth.uid() OR m.receiver_id = auth.uid())
  )
);

CREATE POLICY "Users can unpin messages"
ON public.pinned_messages FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM messages m
    WHERE m.group_id = pinned_messages.group_id
    AND (m.sender_id = auth.uid() OR m.receiver_id = auth.uid())
  )
);