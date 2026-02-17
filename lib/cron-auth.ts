import { timingSafeEqual } from "crypto";

/**
 * Timing-safe verification of cron secret from Authorization header.
 * Prevents timing attacks on the CRON_SECRET comparison.
 */
export function verifyCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !authHeader) return false;

  const expected = `Bearer ${secret}`;
  if (authHeader.length !== expected.length) return false;

  return timingSafeEqual(
    Buffer.from(authHeader),
    Buffer.from(expected)
  );
}
