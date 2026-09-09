import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useContact from '@/app/contact/useContact';

describe('useContact submit() validation', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('flags all required fields when the form is empty', async () => {
    const { result } = renderHook(() => useContact());

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.fieldErrors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      email: 'Email is required.',
    });
    // Validation failed client-side, so no request should have gone out.
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an email missing an "@"', async () => {
    const { result } = renderHook(() => useContact());

    act(() => {
      result.current.setForm({
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '',
        email: 'not-an-email',
        company: '',
      });
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.fieldErrors).toEqual({
      email: 'Enter a valid email address.',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an email missing a domain suffix', async () => {
    const { result } = renderHook(() => useContact());

    act(() => {
      result.current.setForm({
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '',
        email: 'ada@example',
        company: '',
      });
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.fieldErrors.email).toBe('Enter a valid email address.');
  });

  it('accepts a valid email and submits when required fields are present', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContact());

    act(() => {
      result.current.setForm({
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '555-0100',
        email: 'ada@example.com',
        company: '',
      });
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.fieldErrors).toEqual({});
    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.current.status).toBe('success');
    // Form resets to empty after a successful submit.
    expect(result.current.form.firstName).toBe('');
  });

  it('does not validate or send the honeypot "company" field', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useContact());

    // Only the honeypot is filled in; every real field is left blank.
    act(() => {
      result.current.setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: 'a bot filled this in',
      });
    });

    await act(async () => {
      await result.current.submit();
    });

    // A blank firstName/lastName/email should still fail validation —
    // filling the honeypot must not exempt the real required fields.
    expect(result.current.status).toBe('error');
    expect(result.current.fieldErrors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      email: 'Email is required.',
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
