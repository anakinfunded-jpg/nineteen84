-- Add new usage tracking columns for new services
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS tts_used integer DEFAULT 0;
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS stt_used integer DEFAULT 0;
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS ocr_used integer DEFAULT 0;
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS inpainting_used integer DEFAULT 0;

-- Atomic increment functions for new services
CREATE OR REPLACE FUNCTION increment_tts(p_user_id uuid, p_period text, p_count integer DEFAULT 1)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_usage (user_id, period, tts_used)
  VALUES (p_user_id, p_period, p_count)
  ON CONFLICT (user_id, period)
  DO UPDATE SET tts_used = user_usage.tts_used + p_count;
END;
$$;

CREATE OR REPLACE FUNCTION increment_stt(p_user_id uuid, p_period text, p_count integer DEFAULT 1)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_usage (user_id, period, stt_used)
  VALUES (p_user_id, p_period, p_count)
  ON CONFLICT (user_id, period)
  DO UPDATE SET stt_used = user_usage.stt_used + p_count;
END;
$$;

CREATE OR REPLACE FUNCTION increment_ocr(p_user_id uuid, p_period text, p_count integer DEFAULT 1)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_usage (user_id, period, ocr_used)
  VALUES (p_user_id, p_period, p_count)
  ON CONFLICT (user_id, period)
  DO UPDATE SET ocr_used = user_usage.ocr_used + p_count;
END;
$$;

CREATE OR REPLACE FUNCTION increment_inpainting(p_user_id uuid, p_period text, p_count integer DEFAULT 1)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_usage (user_id, period, inpainting_used)
  VALUES (p_user_id, p_period, p_count)
  ON CONFLICT (user_id, period)
  DO UPDATE SET inpainting_used = user_usage.inpainting_used + p_count;
END;
$$;
