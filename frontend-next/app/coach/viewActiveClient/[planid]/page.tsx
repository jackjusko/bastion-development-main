'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ViewActiveClientPage() {
  const { planid } = useParams<{ planid: string }>();
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    api(`/viewActiveClient/${planid}`).then(setPayload);
  }, [planid]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{payload?.clientInfo?.NAME}</h1>
      <img src={payload?.clientInfo?.PROFILEPICTURE} className="profileImage" alt="" />
      <p>{payload?.pricingInfo?.TITLE} — ${payload?.pricingInfo?.PRICE}</p>
      <p>Started {payload?.startDate}</p>
    </div>
  );
}
