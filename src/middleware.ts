import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/upload', '/vote', '/results', '/credits', '/settings'];

// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/register'];

// Rate limiting configuration (in-memory for edge, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMITS: Record<string, number> = {
  '/api/votes': 30, // 30 votes per minute
  '/api/photos': 10, // 10 uploads per minute
  '/api/payments': 5, // 5 payment attempts per minute
  default: 100, // 100 requests per minute for other API routes
};

function getRateLimit(pathname: string): number {
  for (const [path, limit] of Object.entries(RATE_LIMITS)) {
    if (path !== 'default' && pathname.startsWith(path)) {
      return limit;
    }
  }
  return RATE_LIMITS['default'] ?? 100;
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number } {
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const limit = getRateLimit(pathname);

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: limit - current.count };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ??
               request.headers.get('x-real-ip') ??
               'anonymous';

    const { allowed, remaining } = checkRateLimit(ip, pathname);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  }

  // Check for session token (NextAuth uses this cookie name)
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const isAuthenticated = !!sessionToken;

  // Protected routes - redirect to login if not authenticated
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
