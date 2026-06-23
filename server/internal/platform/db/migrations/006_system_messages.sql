-- Add message_type column to support system messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(20) DEFAULT 'user';

-- Add index for message_type queries
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(event_id, message_type);

-- Update existing messages to be 'user' type
UPDATE messages SET message_type = 'user' WHERE message_type IS NULL;