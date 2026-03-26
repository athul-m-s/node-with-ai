import rateLimit from "express-rate-limit";

/**
 * Strict limiter for auth endpoints (login / register).
 * 10 attempts per 15 minutes per IP.
 * Failed requests are NOT counted towards the limit reset
 * (skipSuccessfulRequests: false means even successful ones count,
 *  which is intentional — you don't want bots registering 100 accounts either).
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per window per IP
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  // Skip rate limiting in test environment
  skip: () =>
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development",
});

/**
 * General API limiter — applied at app level.
 * 100 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please slow down.",
  },
  skip: () =>
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development",
});
