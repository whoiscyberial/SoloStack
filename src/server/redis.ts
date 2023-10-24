import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "@/env.mjs";

export const revalidate = 0; // disable cache

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const createRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(15, "3600 s"),
});
