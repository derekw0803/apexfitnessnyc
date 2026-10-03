import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Logout goes through a server route rather than the browser client's own
 * signOut(), because only server-side code (via lib/supabase/server.ts,
 * which writes through next/headers cookies()) can clear the httpOnly
 * session cookie in a way that's guaranteed to be in sync with how
 * middleware.ts reads/refreshes it. A client-side signOut() call risks the
 * cookie and the client's local state disagreeing.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url));
}
