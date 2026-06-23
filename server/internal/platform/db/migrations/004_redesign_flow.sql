-- Redesign Flow: Enforce unique (event_id, user_id) and support new status 'open'
ALTER TABLE participants DROP CONSTRAINT IF EXISTS unique_participant_event_user;
ALTER TABLE participants ADD CONSTRAINT unique_participant_event_user UNIQUE (event_id, user_id);

-- Ensure events can have status 'open' (between draft and shuffled)
-- No schema change needed, status is TEXT, but we add a comment
COMMENT ON TABLE events IS 'status enum: draft, open, shuffled';
