-- Drop the restrictive foreign key constraint on messages.group_id
-- This allows group_id to reference activity IDs, group IDs, or be null for DMs
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_group_id_fkey;