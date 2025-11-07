-- Enable realtime for activities table
ALTER TABLE activities REPLICA IDENTITY FULL;

-- Add activities table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE activities;