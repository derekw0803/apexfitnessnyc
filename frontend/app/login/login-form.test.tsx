import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from './login-form';

const signInWithPassword = vi.fn();
const resetPasswordForEmail = vi.fn();
const push = vi.fn();
const refresh = vi.fn();

vi.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: (...args: unknown[]) => signInWithPassword(...args),
      resetPasswordForEmail: (...args: unknown[]) => resetPasswordForEmail(...args),
    },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

function fillLogin(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
}

describe('LoginForm', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    resetPasswordForEmail.mockReset();
    push.mockReset();
    refresh.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('signs in and redirects to `next` on success', async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm next="/dashboard" />);
    fillLogin('client@example.com', 'correct-password');
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: 'client@example.com',
        password: 'correct-password',
      });
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows the error message inline and does not redirect on failure', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });

    render(<LoginForm next="/dashboard" />);
    fillLogin('client@example.com', 'wrong-password');
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect((await screen.findByText('Invalid login credentials')).textContent).toBe(
      'Invalid login credentials'
    );
    expect(push).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('sends a password reset email with the account/set-password redirect', async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });

    render(<LoginForm next="/dashboard" />);
    fireEvent.click(screen.getByRole('button', { name: 'Forgot password?' }));
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'client@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith(
        'client@example.com',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback?next=/account/set-password'),
        })
      );
    });

    const successMessage = await screen.findByText(
      "If that email has an account, we've sent a password reset link."
    );
    expect(successMessage.textContent).toBe(
      "If that email has an account, we've sent a password reset link."
    );
  });
});
