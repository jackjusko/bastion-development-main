'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

type Pricing = { ID: number; COACHID: number; TITLE: string; DESCRIPTION: string; PRICE: number; FEATURES: { FEATURE: string }[] };

export default function MembershipsPage() {
  const { profile } = useSession();
  const [pricings, setPricings] = useState<Pricing[]>([]);

  async function load() {
    const rows = await api<Pricing[]>('/getPricings');
    setPricings(rows);
  }

  useEffect(() => {
    load().catch(() => setPricings([]));
  }, []);

  async function save(event: FormEvent, pricing: Pricing) {
    event.preventDefault();
    await api('/updatePricings', {
      method: 'POST',
      body: JSON.stringify({ ...pricing, FEATURES: pricing.FEATURES || [] })
    });
    load();
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Memberships</h1>
      {pricings.map((pricing, i) => (
        <form key={pricing.ID} className="box" onSubmit={(e) => save(e, pricing)}>
          <input className="input" value={pricing.TITLE} onChange={(e) => {
            const next = [...pricings];
            next[i] = { ...pricing, TITLE: e.target.value };
            setPricings(next);
          }} />
          <textarea className="textarea" value={pricing.DESCRIPTION} onChange={(e) => {
            const next = [...pricings];
            next[i] = { ...pricing, DESCRIPTION: e.target.value };
            setPricings(next);
          }} />
          <input className="input" type="number" value={pricing.PRICE} onChange={(e) => {
            const next = [...pricings];
            next[i] = { ...pricing, PRICE: Number(e.target.value) };
            setPricings(next);
          }} />
          <button className="button b-button" type="submit">Save</button>
        </form>
      ))}
      {profile?.ID ? <p>Coach id {profile.ID}</p> : null}
    </div>
  );
}
