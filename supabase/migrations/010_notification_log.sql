-- Notification log for deduplication (trial warnings, usage alerts)
CREATE TABLE IF NOT EXISTS notification_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Prevent duplicate notifications
CREATE UNIQUE INDEX idx_notification_log_unique ON notification_log(user_id, type);

-- Fast lookup by user
CREATE INDEX idx_notification_log_user ON notification_log(user_id);

-- RLS
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (cron jobs use admin client)
-- No user-facing policies needed
