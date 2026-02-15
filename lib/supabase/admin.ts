import { createClient } from "@supabase/supabase-js";

// Server-only admin client using the service role key.
// Bypasses RLS — use only in trusted server contexts (API routes).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
