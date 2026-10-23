/**
 * Role routing after login. Coaches and admins never land on the client dashboard.
 */
import type { Profile } from './api';

export function dashboardPath(profile: Pick<Profile, 'ISCOACH' | 'ADMIN'> | null): string {
  if (!profile) {
    return '/dashboard';
  }
  if (profile.ADMIN === 1) {
    return '/admin/dashboard';
  }
  if (profile.ISCOACH === 1) {
    return '/coach/dashboard';
  }
  return '/dashboard';
}
