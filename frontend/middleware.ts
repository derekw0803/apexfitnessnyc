import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_PREFIXES = ['/dashboard', '/account', '/payments', '/library'];
const ADMIN_PREFIX = '/admin';

export async function middleware(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith(ADMIN_PREFIX);
  const isProtectedRoute = isAdminRoute || PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  if (!isProtectedRoute) {
    return response;
  }

  if (!claims) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    // JWT claim only — fast path for routing. Every /admin page and
    // /api/admin route independently re-checks (and every admin-gated
    // write re-verifies against the database), so a stale claim here can
    // only ever be too permissive for page *rendering*, never for an
    // actual write — see lib/auth.ts's verifyIsAdmin().
    const isAdmin = (claims as Record<string, unknown>).is_admin === true;

    if (!isAdmin) {
      // A genuine 404, not a redirect or 403 — indistinguishable from a
      // route that was never built, per "hidden protected pages by rule".
      const notFoundUrl = new URL('/__admin_guard', request.url);
      return NextResponse.rewrite(notFoundUrl, { status: 404 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization,
     * so the session cookie still refreshes on every real navigation.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
