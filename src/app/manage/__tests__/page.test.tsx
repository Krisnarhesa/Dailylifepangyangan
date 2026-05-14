import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminLoginPage from '@/app/admin/page';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AdminLoginPage', () => {
  it('renders login form', () => {
    render(<AdminLoginPage />);

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error when login fails', async () => {
    const { supabase } = require('@/lib/supabase');
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('disables button while loading', async () => {
    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
