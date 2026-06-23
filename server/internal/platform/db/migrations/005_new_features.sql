-- Feature: Preferences
CREATE TABLE IF NOT EXISTS preferences (
  participant_id UUID PRIMARY KEY REFERENCES participants(id) ON DELETE CASCADE,
  favorite_color TEXT,
  clothing_size TEXT,
  favorite_food TEXT,
  hobbies TEXT,
  allergies TEXT,
  price_range TEXT,
  about_me TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_preferences_participant ON preferences(participant_id);

-- Feature: Gift Progress
CREATE TABLE IF NOT EXISTS gift_progress (
  participant_id UUID PRIMARY KEY REFERENCES participants(id) ON DELETE CASCADE,
  purchased BOOLEAN DEFAULT FALSE,
  wrapped BOOLEAN DEFAULT FALSE,
  delivered BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gift_progress_participant ON gift_progress(participant_id);

-- Feature: Gallery Photos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_data TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gallery_event ON gallery_photos(event_id);

-- Feature: Event Date
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE;
