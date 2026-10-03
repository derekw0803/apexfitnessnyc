/**
 * Pure formatting helpers for the client dashboard.
 *
 * Extracted from the page component (a server component doing data
 * fetching) so the one piece of non-trivial logic here — turning a jsonb
 * metric column into a safe, human-readable list — is unit testable without
 * mocking Supabase or Next's server-component machinery.
 */

export type JsonbEntry = { label: string; value: string };

/**
 * Formats a jsonb health-metric column (macros / endurance / one_rep_max)
 * into label/value pairs for display. Handles null/undefined, non-object
 * values, and arrays without throwing — health_metrics rows are historical
 * data entered by hand, not schema-validated at write time.
 */
export function formatJsonbEntries(value: unknown): JsonbEntry[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];

  return Object.entries(value as Record<string, unknown>).map(([key, v]) => ({
    label: humanizeKey(key),
    value: stringifyValue(v),
  }));
}

function humanizeKey(key: string): string {
  const spaced = key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** Formats an ISO date string (e.g. "2026-09-08") for display. Passes
 * through anything that isn't a parseable date rather than showing
 * "Invalid Date". */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
