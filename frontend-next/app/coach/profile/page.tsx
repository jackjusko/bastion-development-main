'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function CoachProfilePage() {
  const { profile } = useSession();
  const [balance, setBalance] = useState<{ available: number; pending: number } | null>(null);

  useEffect(() => {
    api<{ available: number; pending: number }>('/getStripeBalance').then(setBalance).catch(() => setBalance({ available: 0, pending: 0 }));
  }, []);

  async function openLogin() {
    const url = await api<string>('/getStripeLoginURL');
    window.open(url, '_blank');
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <img src={profile?.PROFILEPICTURE} className="profileImage" alt="" />
      <h1>{profile?.NAME}</h1>
      <p>{profile?.ABOUT}</p>
      <p><span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bastion Balance:</span> ${balance?.available ?? 0} available / ${balance?.pending ?? 0} pending</p>
      <button className="button b-button" onClick={openLogin}>Open payouts</button>
    </div>
  );
}
