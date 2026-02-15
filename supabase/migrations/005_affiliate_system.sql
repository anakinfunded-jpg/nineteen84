-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected')),
  commission_rate numeric(4,2) DEFAULT 30.00,
  stripe_coupon_id text,
  total_clicks integer DEFAULT 0,
  total_signups integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  total_earned numeric(10,2) DEFAULT 0,
  total_paid numeric(10,2) DEFAULT 0,
  milestone text DEFAULT 'none' CHECK (milestone IN ('none','bronze','silver','gold','platinum','diamond')),
  instagram text,
  tiktok text,
  youtube text,
  website text,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);

-- Click tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  ip_hash text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON affiliate_clicks(created_at);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_subscription_id text,
  plan_id text NOT NULL,
  amount numeric(10,2) NOT NULL,
  commission numeric(10,2) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active','canceled','refunded')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_referred ON affiliate_conversions(referred_user_id);

-- Payout records
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  period text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed')),
  notes text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_period ON affiliate_payouts(period);

-- Add affiliate tracking to subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS affiliate_id uuid REFERENCES affiliates(id) ON DELETE SET NULL;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS affiliate_code text;

-- No RLS on affiliate tables — accessed via admin client (service role)
