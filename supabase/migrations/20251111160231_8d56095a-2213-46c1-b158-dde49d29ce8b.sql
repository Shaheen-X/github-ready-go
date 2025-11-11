-- Add reply_to column to messages table
ALTER TABLE public.messages 
ADD COLUMN reply_to_message_id text,
ADD CONSTRAINT fk_reply_to_message 
  FOREIGN KEY (reply_to_message_id) 
  REFERENCES public.messages(message_id) 
  ON DELETE SET NULL;