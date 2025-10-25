-- Add time flexibility fields to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS proposed_times jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS time_status text DEFAULT 'flexible' CHECK (time_status IN ('flexible', 'proposed', 'confirmed')),
ADD COLUMN IF NOT EXISTS time_flexibility text; -- e.g., "Weekends", "Weekday Evenings", "Anytime"

-- Add comment for clarity
COMMENT ON COLUMN activities.time_status IS 'flexible = time TBD, proposed = specific times suggested, confirmed = final time set';
COMMENT ON COLUMN activities.proposed_times IS 'Array of proposed time slots with format [{datetime, proposed_by_id}]';
COMMENT ON COLUMN activities.time_flexibility IS 'Human-readable description like "Weekends", "Weekday Evenings"';