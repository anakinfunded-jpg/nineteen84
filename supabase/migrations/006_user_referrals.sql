-- User-to-user invite/referral system (separate from affiliate program)
CREATE TABLE user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_email text,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','converted')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_referrals_referrer ON user_referrals(referrer_id);
CREATE UNIQUE INDEX idx_user_referrals_referred ON user_referrals(referred_user_id) WHERE referred_user_id IS NOT NULL;

-- Lookup user by invite code (first 8 chars of their UUID)
CREATE OR REPLACE FUNCTION find_user_by_invite_code(code text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM auth.users
  WHERE id::text LIKE code || '%'
  LIMIT 1;
$$;
