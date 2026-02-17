import { createAdminClient } from "@/lib/supabase/admin";
import { getUserPlan } from "@/lib/credits";
import { createHash } from "crypto";

export interface ApiUser {
  userId: string;
  planId: "poslovno";
}

export async function validateApiKey(request: Request): Promise<ApiUser> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "API ključ je obvezen. Uporabite: Authorization: Bearer 1984_...");
  }

  const token = authHeader.slice(7);
  if (!token.startsWith("1984_") || token.length < 20) {
    throw new ApiError(401, "Neveljaven format API ključa.");
  }

  const hash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();

  const { data: keyRecord } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .single();

  if (!keyRecord) {
    throw new ApiError(401, "Neveljaven API ključ.");
  }

  const planId = await getUserPlan(keyRecord.user_id);
  if (planId !== "poslovno") {
    throw new ApiError(403, "API dostop je na voljo samo za Poslovni paket.");
  }

  // Update last_used_at (fire-and-forget)
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyRecord.id)
    .then();

  return { userId: keyRecord.user_id, planId: "poslovno" };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { success: false, error: { message: error.message } },
      { status: error.status }
    );
  }
  return Response.json(
    { success: false, error: { message: "Notranja napaka strežnika." } },
    { status: 500 }
  );
}
