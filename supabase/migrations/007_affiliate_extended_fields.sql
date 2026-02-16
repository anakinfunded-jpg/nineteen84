-- Extended affiliate application fields
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS linkedin text;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS audience_size text CHECK (audience_size IN ('1000-5000','5000-20000','20000-50000','50000+'));
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS niche text;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS promo_plan text;
