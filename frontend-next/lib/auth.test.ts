import { describe, expect, it } from 'vitest';
import { dashboardPath } from './auth';

describe('dashboardPath', () => {
  it('sends admins to the admin dashboard', () => {
    expect(dashboardPath({ ISCOACH: 0, ADMIN: 1 })).toBe('/admin/dashboard');
  });

  it('sends coaches to the coach dashboard', () => {
    expect(dashboardPath({ ISCOACH: 1, ADMIN: 0 })).toBe('/coach/dashboard');
  });

  it('sends clients to the client dashboard', () => {
    expect(dashboardPath({ ISCOACH: 0, ADMIN: 0 })).toBe('/dashboard');
  });
});
