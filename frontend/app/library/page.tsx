import Link from 'next/link';
import { getSessionClaims } from '@/lib/auth';
import { getLibraryAccess, type LibraryAccess } from '@/lib/libraryAccess';
import { getExercises, getPatternDescriptions } from '@/lib/exercises';
import ExerciseLibrary from './ExerciseLibrary';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Exercise Library | APEX',
  robots: { index: false, follow: false },
};

const LOCKED_MESSAGES: Record<Exclude<LibraryAccess, 'allowed'>, string> = {
  'signed-out': 'Sign in to your APEX account to open the exercise library.',
  unlinked: "Your account isn't linked to a client profile yet. Contact your trainer to get set up.",
  'no-program':
    'The exercise library is included with every active APEX program. Contact your trainer to enroll or renew.',
};

/**
 * Members-only exercise library. Hidden: not in the nav or sitemap, noindex,
 * and disallowed in robots.txt. middleware.ts requires a signed-in session;
 * lib/libraryAccess.ts then requires a current program enrollment.
 */
export default async function LibraryPage() {
  let access: LibraryAccess;
  try {
    access = await getLibraryAccess(await getSessionClaims());
  } catch (err) {
    console.error('[library] access check failed:', err);
    return <LockedNotice message="We couldn't check your access just now. Please refresh in a moment." />;
  }

  if (access !== 'allowed') return <LockedNotice message={LOCKED_MESSAGES[access]} />;

  let exercises: Awaited<ReturnType<typeof getExercises>>;
  let patternDescriptions: Awaited<ReturnType<typeof getPatternDescriptions>>;
  try {
    [exercises, patternDescriptions] = await Promise.all([getExercises(), getPatternDescriptions()]);
  } catch (err) {
    // Most likely the exercise migration/import hasn't been run on this
    // database yet (see scripts/import_exercises.py).
    console.error('[library] could not load the exercise catalog:', err);
    return <LockedNotice message="The exercise library is being set up. Please check back soon." />;
  }
  if (exercises.length === 0) {
    return <LockedNotice message="The exercise library is being set up. Please check back soon." />;
  }

  return (
    <div className="section" style={{ paddingTop: '4rem' }}>
      <div className="section-inner">
        <ExerciseLibrary exercises={exercises} patternDescriptions={patternDescriptions} />
      </div>
    </div>
  );
}

function LockedNotice({ message }: { message: string }) {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 720 }}>
        <div className="section-label">Members only</div>
        <h1 className="section-h2">Exercise Library</h1>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>{message}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/dashboard" className="btn-gold">Go to Dashboard</Link>
          <Link href="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
