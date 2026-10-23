'use client';

import { MenuRow, ProfileHero } from '@/components/MenuRow';
import { useSession } from '@/lib/session';

export default function AdminDashboardPage() {
  const { profile } = useSession();
  return (
    <div style={{ height: '100%' }}>
      <ProfileHero src={profile?.PROFILEPICTURE} title={`Administrator ${profile?.NAME || ''}`} />
      <div className="optionsContainer">
        <MenuRow href="/admin/clients">Clients</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/admin/coaches">Coaches</MenuRow>
      </div>
    </div>
  );
}
