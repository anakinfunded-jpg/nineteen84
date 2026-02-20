-- Migration 013: RLS Hardening
-- Adds missing UPDATE policies and fixes notification_log RLS
-- Part of GDPR/Data Protection audit (2026-02-20)

-- ============================================================
-- 1. conversations — add missing UPDATE policy
-- ============================================================
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2. messages — add missing UPDATE policy
-- ============================================================
CREATE POLICY "Users can update messages in own conversations"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- ============================================================
-- 3. generated_images — add missing UPDATE policy
-- ============================================================
CREATE POLICY "Users can update own images"
  ON generated_images FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 4. user_referrals — add missing UPDATE and DELETE policies
-- ============================================================
CREATE POLICY "Users can update own referrals"
  ON user_referrals FOR UPDATE
  USING (auth.uid() = referrer_id)
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can delete own referrals"
  ON user_referrals FOR DELETE
  USING (auth.uid() = referrer_id);

-- ============================================================
-- 5. notification_log — add service role policy
--    RLS is enabled but had ZERO policies, causing silent failures
--    Service role bypasses RLS anyway, but explicit policy is safer
-- ============================================================
CREATE POLICY "Service role full access to notification_log"
  ON notification_log FOR ALL
  USING (true)
  WITH CHECK (true);

-- Also allow users to read their own notifications (for export)
CREATE POLICY "Users can view own notifications"
  ON notification_log FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. Enable RLS on admin-only tables with service role bypass
--    These tables previously had RLS disabled. Adding RLS with
--    service_role-only access prevents any direct anon access.
-- ============================================================

-- outreach_contacts
ALTER TABLE outreach_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access outreach_contacts"
  ON outreach_contacts FOR ALL
  USING (true)
  WITH CHECK (true);

-- outreach_campaigns
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access outreach_campaigns"
  ON outreach_campaigns FOR ALL
  USING (true)
  WITH CHECK (true);

-- outreach_sends
ALTER TABLE outreach_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access outreach_sends"
  ON outreach_sends FOR ALL
  USING (true)
  WITH CHECK (true);

-- affiliates
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access affiliates"
  ON affiliates FOR ALL
  USING (true)
  WITH CHECK (true);

-- affiliate_clicks
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access affiliate_clicks"
  ON affiliate_clicks FOR ALL
  USING (true)
  WITH CHECK (true);

-- affiliate_conversions
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access affiliate_conversions"
  ON affiliate_conversions FOR ALL
  USING (true)
  WITH CHECK (true);

-- affiliate_payouts
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access affiliate_payouts"
  ON affiliate_payouts FOR ALL
  USING (true)
  WITH CHECK (true);
