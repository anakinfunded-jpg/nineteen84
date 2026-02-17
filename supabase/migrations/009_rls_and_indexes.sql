-- Add RLS to user_referrals table
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON user_referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert own referrals"
  ON user_referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Add missing indexes for document queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id
  ON documents(user_id);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id
  ON document_chunks(document_id);
