-- Add status column to messages table
ALTER TABLE messages
ADD COLUMN status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read'));

-- Create index for better performance
CREATE INDEX idx_messages_status ON messages(status);