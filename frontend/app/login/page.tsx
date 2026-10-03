import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth';
import LoginForm from './login-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login | APEX',
  robots: { index: false, follow: false },
};

/**
 * Server component: decides whether to even show the form. There is
 * deliberately no signup link or form anywhere on this page — account
 * creation is admin-invite-only (see AGENTS.md plan), so an already-signed-in
 * visitor is bounced straight to `next` (or /dashboard) rather than being
 * shown a login screen they don't need.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const claims = await getSessionClaims();

  if (claims) {
    redirect(next || '/dashboard');
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 480 }}>
        <div className="section-label">Members</div>
        <h2 className="section-h2">Login</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
          Sign in to view your dashboard, track your progress, and manage your account.
        </p>

        <LoginForm next={next || '/dashboard'} />
      </div>
    </div>
  );
}
