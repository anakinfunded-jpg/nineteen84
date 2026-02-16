-- Add recurring commission support to affiliate_conversions

-- Add type column (initial vs recurring)
ALTER TABLE affiliate_conversions
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'initial';

-- Add stripe_invoice_id for dedup
ALTER TABLE affiliate_conversions
  ADD COLUMN IF NOT EXISTS stripe_invoice_id text;

-- Unique index on stripe_invoice_id (prevents double-processing)
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_conversions_invoice
  ON affiliate_conversions (stripe_invoice_id)
  WHERE stripe_invoice_id IS NOT NULL;

-- Index on stripe_subscription_id for lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_subscription
  ON affiliate_conversions (stripe_subscription_id);

-- Change default commission_rate from 30 to 20
ALTER TABLE affiliates
  ALTER COLUMN commission_rate SET DEFAULT 20;

-- Backfill existing records
UPDATE affiliate_conversions SET type = 'initial' WHERE type IS NULL;
