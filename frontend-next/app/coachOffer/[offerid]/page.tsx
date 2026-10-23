'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError, api } from '@/lib/api';

export default function CoachOfferPage() {
  const { offerid } = useParams<{ offerid: string }>();
  const router = useRouter();
  const [offer, setOffer] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/getOffer/${offerid}`).then(setOffer).catch(() => setError('Offer not found.'));
  }, [offerid]);

  async function startCoaching() {
    try {
      await api('/startCoaching', { method: 'POST', body: JSON.stringify({ offerID: Number(offerid) }) });
      router.push('/thankYou');
    } catch (err) {
      if (err instanceof ApiError && err.status === 307) {
        window.location.href = err.body;
        return;
      }
      setError('Unable to start coaching right now.');
    }
  }

  if (!offer) {
    return <div style={{ padding: '2rem' }}>{error || 'Loading…'}</div>;
  }

  return (
    <div className="coachOfferPage">
      <img src={offer.profileInfo?.PROFILEPICTURE} alt="" className="profileImage" />
      <h1>{offer.profileInfo?.NAME}</h1>
      <p>{offer.profileInfo?.LOCATION}</p>
      <p>{offer.profileInfo?.ABOUT}</p>
      <h2>{offer.pricingInfo?.TITLE} — ${offer.pricingInfo?.PRICE}</h2>
      <p>{offer.pricingInfo?.DESCRIPTION}</p>
      <ul>
        {(offer.pricingInfo?.FEATURES || []).map((feature: { FEATURE: string }, i: number) => (
          <li key={i}>{feature.FEATURE}</li>
        ))}
      </ul>
      <button className="button b-button" onClick={startCoaching}>Start Coaching</button>
    </div>
  );
}
