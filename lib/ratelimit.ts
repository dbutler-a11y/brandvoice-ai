/**
 * Simple in-memory rate limiter
 *
 * For production, consider using Redis-based rate limiting with:
 * - @upstash/ratelimit
 * - ioredis
 * - or similar distributed solutions
 */

interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
}

interface RateLimitStore {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart)
const store = new Map<string, RateLimitStore>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const RATE_LIMIT_CONFIGS = {
  STRICT: { requests: 5, window: 60000 },      // 5 per minute
  STANDARD: { requests: 30, window: 60000 },   // 30 per minute
  RELAXED: { requests: 60, window: 60000 },    // 60 per minute
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (e.g., IP, user ID)
 * @param config - Rate limit configuration
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
} {
  const now = Date.now();
  const key = `${identifier}:${config.requests}:${config.window}`;

  let record = store.get(key);

  // Reset if window has passed
  if (!record || record.resetAt < now) {
    record = {
      count: 0,
      resetAt: now + config.window,
    };
    store.set(key, record);
  }

  const remaining = Math.max(0, config.requests - record.count);
  const success = record.count < config.requests;

  if (success) {
    record.count++;
  }

  return {
    success,
    remaining: success ? remaining - 1 : remaining,
    reset: record.resetAt,
    limit: config.requests,
  };
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try multiple headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Apply rate limit to a request
 * Returns null if allowed, or a Response object if rate limited
 */
export function applyRateLimit(
  request: Request,
  limitType: RateLimitType
): { response: Response | null; result: ReturnType<typeof checkRateLimit> } {
  const identifier = getClientIdentifier(request);
  const config = RATE_LIMIT_CONFIGS[limitType];
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    return {
      response: new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`,
          limit: result.limit,
          reset: result.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      ),
      result,
    };
  }

  return { response: null, result };
}
