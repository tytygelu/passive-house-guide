export const allowedPaths = [
  '/api/contact',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/site.webmanifest'
];

export const rateLimitConfig = {
  maxRequests: 100,
  windowMs: 1000 * 60
};
