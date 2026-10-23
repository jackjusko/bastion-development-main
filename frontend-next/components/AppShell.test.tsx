import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() })
}));

vi.mock('@/lib/session', () => ({
  useSession: () => ({
    token: '',
    profile: null,
    loading: false,
    message: '',
    refresh: vi.fn(),
    goDashboard: vi.fn(),
    logOut: vi.fn(),
    flash: vi.fn()
  })
}));

describe('AppShell', () => {
  it('shows guest navigation including Login', () => {
    render(
      <AppShell>
        <div>child</div>
      </AppShell>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
  });
});
