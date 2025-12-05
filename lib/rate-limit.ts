import { NextRequest } from 'next/server';

/**
 * Rate limit tiers with requests per minute limits
 */
export enum RateLimitTier {
  STRICT = 'STRICT',     // 5 requests per minute - for expensive operations
  STANDARD = 'STANDARD', // 30 requests per minute - for normal API calls
  RELAXED = 'RELAXED',   // 100 requests per minute - for lightweight operations
}

/**
 * Configuration for each rate limit tier
 */
const RATE_LIMIT_CONFIG: Record<RateLimitTier, number> = {
  [RateLimitTier.STRICT]: 5,
  [RateLimitTier.STANDARD]: 30,
  [RateLimitTier.RELAXED]: 100,
};

/**
 * Time window for rate limiting (1 minute in milliseconds)
 */
const WINDOW_MS = 60 * 1000;

/**
 * Request tracking entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for rate limiting
 * Key format: `${ip}:${tier}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Extract IP address from Next.js request
 * Checks common headers in order of priority
 */
function getClientIP(request: NextRequest): string {
  // Check forwarded IP headers (common in production behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim();
  }

  // Fallback to a default value (should rarely happen in production)
  return 'unknown';
}

/**
 * Clean up expired entries from the rate limit store
 * This prevents memory leaks by removing entries older than the window
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (entry.resetTime < now) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => rateLimitStore.delete(key));
}

/**
 * Perform rate limiting check for a request
 *
 * @param request - Next.js request object
 * @param tier - Rate limit tier to apply
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * ```typescript
 * const result = rateLimit(request, RateLimitTier.STANDARD);
 * if (!result.success) {
 *   return rateLimitResponse();
 * }
 * ```
 */
export function rateLimit(
  request: NextRequest,
  tier: RateLimitTier = RateLimitTier.STANDARD
): RateLimitResult {
  const ip = getClientIP(request);
  const limit = RATE_LIMIT_CONFIG[tier];
  const now = Date.now();
  const key = `${ip}:${tier}`;

  // Cleanup old entries periodically (10% chance on each request)
  // This prevents the cleanup from running on every request
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  // If no entry exists or the window has expired, create a new one
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment the request count
  entry.count++;

  // Calculate remaining requests
  const remaining = Math.max(0, limit - entry.count);
  const success = entry.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: entry.resetTime,
  };
}

/**
 * Create a standardized 429 Too Many Requests response
 *
 * @param result - Optional rate limit result to include in headers
 * @returns Next.js Response object with 429 status
 *
 * @example
 * ```typescript
 * const result = rateLimit(request, RateLimitTier.STRICT);
 * if (!result.success) {
 *   return rateLimitResponse(result);
 * }
 * ```
 */
export function rateLimitResponse(result?: RateLimitResult): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (result) {
    headers['X-RateLimit-Limit'] = result.limit.toString();
    headers['X-RateLimit-Remaining'] = result.remaining.toString();
    headers['X-RateLimit-Reset'] = result.reset.toString();
    headers['Retry-After'] = Math.ceil((result.reset - Date.now()) / 1000).toString();
  }

  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      ...(result && {
        limit: result.limit,
        remaining: result.remaining,
        resetAt: new Date(result.reset).toISOString(),
      }),
    }),
    {
      status: 429,
      headers,
    }
  );
}

/**
 * Add rate limit headers to a successful response
 *
 * @param response - Existing Response object
 * @param result - Rate limit result
 * @returns Response with added rate limit headers
 *
 * @example
 * ```typescript
 * const result = rateLimit(request, RateLimitTier.STANDARD);
 * if (!result.success) {
 *   return rateLimitResponse(result);
 * }
 *
 * const response = NextResponse.json({ data: 'success' });
 * return addRateLimitHeaders(response, result);
 * ```
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.reset.toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Middleware-style wrapper for API routes with automatic rate limiting
 *
 * @param handler - API route handler function
 * @param tier - Rate limit tier to apply
 * @returns Wrapped handler with rate limiting
 *
 * @example
 * ```typescript
 * export const GET = withRateLimit(
 *   async (request: NextRequest) => {
 *     return NextResponse.json({ data: 'success' });
 *   },
 *   RateLimitTier.STANDARD
 * );
 * ```
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response> | Response,
  tier: RateLimitTier = RateLimitTier.STANDARD
) {
  return async (request: NextRequest): Promise<Response> => {
    const result = rateLimit(request, tier);

    if (!result.success) {
      return rateLimitResponse(result);
    }

    const response = await handler(request);
    return addRateLimitHeaders(response, result);
  };
}

/**
 * Get current rate limit status without incrementing the counter
 * Useful for checking rate limit status without consuming a request
 *
 * @param request - Next.js request object
 * @param tier - Rate limit tier to check
 * @returns Current rate limit status
 */
export function getRateLimitStatus(
  request: NextRequest,
  tier: RateLimitTier = RateLimitTier.STANDARD
): RateLimitResult {
  const ip = getClientIP(request);
  const limit = RATE_LIMIT_CONFIG[tier];
  const now = Date.now();
  const key = `${ip}:${tier}`;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now + WINDOW_MS,
    };
  }

  const remaining = Math.max(0, limit - entry.count);
  const success = entry.count < limit;

  return {
    success,
    limit,
    remaining,
    reset: entry.resetTime,
  };
}

/**
 * Clear all rate limit entries (useful for testing)
 * DO NOT use in production unless you have a specific reason
 */
export function clearRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get the current size of the rate limit store
 * Useful for monitoring memory usage
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}
