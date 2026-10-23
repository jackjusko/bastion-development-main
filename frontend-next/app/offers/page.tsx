'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type OfferCard = { ID: number; name: string; profilePicture: string; title: string; price: number };

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferCard[]>([]);

  useEffect(() => {
    api<OfferCard[]>('/getOffersDisplay').then(setOffers).catch(() => setOffers([]));
  }, []);

  return (
    <div data-testid="offers-page">
      <div className="numberCoachOffers">You&apos;ve received offers from {offers.length} coach(s).</div>
      <br />
      {offers.map((offer) => (
        <div className="columns is-mobile coachingOffer box nopadding" key={offer.ID}>
          <div className="column is-6 nopadding">
            <img className="offerImage" src={offer.profilePicture} alt="" />
          </div>
          <div className="column" style={{ padding: '1rem' }}>
            <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>{offer.name}</span>
            <br />
            <span style={{ fontSize: '1rem' }}>{offer.title} <br /> ({offer.price} USD)</span>
            <br /><br />
            <Link href={`/coachOffer/${offer.ID}`}><span style={{ color: 'var(--teal)', textDecoration: 'underline' }}>View Offer</span></Link>
          </div>
        </div>
      ))}
    </div>
  );
}
