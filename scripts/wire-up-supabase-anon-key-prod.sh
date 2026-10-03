#!/usr/bin/env bash
# One-time wizard: set the Supabase anon (public) key as a Vercel production
# env var. This key genuinely can't be fetched programmatically here — it's
# dashboard-only, no Supabase management API token is on file for this
# project.
#
# Before running: Supabase dashboard -> Project Settings -> API -> copy the
# "anon" / "public" key (NOT the service_role key — that one must never
# touch this script or the browser).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

if [ ! -f "$REPO_ROOT/.env" ]; then
  echo "Error: $REPO_ROOT/.env not found (expected VERCEL_TOKEN in it)." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a && source "$REPO_ROOT/.env" && set +a
unset VERCEL_PROJECT_ID VERCEL_ORG_ID

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "Error: VERCEL_TOKEN is not set in $REPO_ROOT/.env" >&2
  exit 1
fi

read -r -s -p "Supabase anon/public key (input hidden): " ANON_KEY_INPUT
echo
if [ -z "$ANON_KEY_INPUT" ]; then
  echo "Error: empty key entered." >&2
  exit 1
fi

cd "$FRONTEND_DIR"
printf '%s' "$ANON_KEY_INPUT" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token="$VERCEL_TOKEN"

echo
echo "== Done =="
echo "Also add it to frontend/.env.local for local dev (not committed, gitignored):"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<the same value>"
echo "Redeploy before testing login/auth in production — env var changes"
echo "don't affect an already-built deployment."
