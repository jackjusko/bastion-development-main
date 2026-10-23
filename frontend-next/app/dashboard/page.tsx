'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MenuRow, ProfileHero } from '@/components/MenuRow';
import { api } from '@/lib/api';
import { dashboardPath } from '@/lib/auth';
import { useSession } from '@/lib/session';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { profile, loading, flash } = useSession();

  useEffect(() => {
    if (!loading && profile && dashboardPath(profile) !== '/dashboard') {
      router.replace(dashboardPath(profile));
    }
  }, [loading, profile, router]);

  async function openPortal() {
    const url = await api<string>('/getStripePortalURL');
    window.open(url, '_blank');
  }

  async function checkOffers() {
    const offers = await api<unknown[]>('/getOffers');
    if (!offers.length) {
      flash("We're still looking for coaches for you - check back soon.");
      return;
    }
    router.push('/offers');
  }

  return (
    <div className="coachBackground" style={{ height: '100%' }} data-testid="client-dashboard">
      <ProfileHero src={profile?.PROFILEPICTURE} title={profile?.NAME || ''} />
      <div className="optionsContainer">
        {profile?.COACHID === -1 || !profile?.COACHID ? (
          <MenuRow onClick={checkOffers}>My Coaching Offers</MenuRow>
        ) : (
          <MenuRow href="/viewCoach">My Coach</MenuRow>
        )}
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow onClick={openPortal}>My Billing Portal</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/editProfile">My Profile</MenuRow>
        <div className="b-breaker breaker-adjust" style={{ opacity: 0.5 }} />
        <MenuRow href="/messageHome">Messages</MenuRow>
      </div>
    </div>
  );
}
