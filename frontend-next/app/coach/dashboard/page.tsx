'use client';

import { MenuRow, ProfileHero } from '@/components/MenuRow';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function CoachDashboardPage() {
  const { profile } = useSession();

  async function openPortal() {
    const url = await api<string>('/getStripeLoginURL');
    window.open(url, '_blank');
  }

  return (
    <div className="coachBackground" style={{ height: '100%' }}>
      <ProfileHero src={profile?.PROFILEPICTURE} title={`Coach ${profile?.NAME || ''}`} />
      <div className="optionsContainer">
        <MenuRow href="/coach/clients">Clients</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/memberships">Memberships</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/coach/profile">My Profile</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow onClick={openPortal}>My Payouts Portal</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/messageHome">Messages</MenuRow>
      </div>
    </div>
  );
}
