
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using 'jose' for JWT verification as 'jsonwebtoken' is not ideal for Edge runtime

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenCookie = request.cookies.get('auth_token');

  const publicApiPaths = ['/api/auth/login', '/api/auth/register'];
  const isPublicApiPath = publicApiPaths.some(path => pathname.startsWith(path));

  // Allow public API paths to proceed without token check
  if (isPublicApiPath) {
    return NextResponse.next();
  }

  // For all other API routes, token is required
  if (pathname.startsWith('/api/')) {
    if (!authTokenCookie || !authTokenCookie.value) {
      return NextResponse.json({ error: 'Unauthorized: Authentication token is missing.' }, { status: 401 });
    }

    try {
      await jwtVerify(authTokenCookie.value, JWT_SECRET);
      // Token is valid, proceed
      return NextResponse.next();
    } catch (error) {
      console.error('JWT Verification Error in Middleware:', error);
      // Token is invalid or expired, clear it and deny access
      const response = NextResponse.json({ error: 'Unauthorized: Invalid or expired token.' }, { status: 401 });
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  // For non-API routes, let Next.js handle rendering
  return NextResponse.next();
}

// Specify paths for the middleware to run on
export const config = {
  // Match all API routes, but allow public auth routes via logic inside middleware
  // Also match dashboard and admin routes for potential client-side auth checks or redirects if needed
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin/:path*'],
};
