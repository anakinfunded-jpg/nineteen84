import { randomBytes, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ApiKeyInfo {
  id: string;
  key_prefix: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export async function generateApiKey(
  userId: string,
  name: string
): Promise<{ key: string; prefix: string; id: string }> {
  const raw = "1984_" + randomBytes(32).toString("hex");
  const prefix = raw.slice(0, 9);
  const hash = createHash("sha256").update(raw).digest("hex");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: userId,
      key_hash: hash,
      key_prefix: prefix,
      name: name.trim() || "API ključ",
    })
    .select("id")
    .single();

  if (error) throw new Error("Napaka pri ustvarjanju API ključa.");
  return { key: raw, prefix, id: data.id };
}

export async function revokeApiKey(
  userId: string,
  keyId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("user_id", userId);

  return !error;
}

export async function listApiKeys(userId: string): Promise<ApiKeyInfo[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("api_keys")
    .select("id, key_prefix, name, created_at, last_used_at")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (data as ApiKeyInfo[]) || [];
}

export async function countApiKeys(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true);

  return count || 0;
}
