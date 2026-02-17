import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// AI text routes: 20 requests per 60 seconds per user
export const aiTextLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "rl:ai-text",
});

// AI image routes (expensive): 10 requests per 60 seconds per user
export const aiImageLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "rl:ai-image",
});

// Auth routes: 5 attempts per 60 seconds per IP
export const authLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rl:auth",
});

// API v1 text routes: 60 requests per 60 seconds per user
export const apiLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "rl:api",
});

// API v1 image routes (expensive): 10 requests per 60 seconds per user
export const apiImageLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "rl:api-image",
});

// Memory/embedding routes: 10 requests per 60 seconds per user
export const memoryLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "rl:memory",
});

// File parse utility: 20 requests per 60 seconds per user
export const parseLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "rl:parse",
});

export function rateLimitResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Preveč zahtevkov. Počakajte nekaj sekund." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    }
  );
}
