import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSupabaseAuthConfig } from '@/lib/supabase/config';
import { updateSession } from '@/lib/supabase/middleware';

describe('Supabase auth config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns the URL and anon key when both are set', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon');
    expect(getSupabaseAuthConfig()).toEqual({ url: 'https://example.supabase.co', anonKey: 'anon' });
  });

  it.each([
    ['URL', 'NEXT_PUBLIC_SUPABASE_URL'],
    ['anon key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  ])('returns null when the %s is missing', (_label, missing) => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon');
    vi.stubEnv(missing, '');
    expect(getSupabaseAuthConfig()).toBeNull();
  });

  it('lets middleware treat the request as signed out instead of throwing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { response, claims } = await updateSession(new NextRequest('http://localhost/pricing'));

    expect(claims).toBeNull();
    expect(response.status).toBe(200);
  });
});
