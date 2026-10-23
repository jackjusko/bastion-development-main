'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminViewCoachPage() {
  const { coachid } = useParams<{ coachid: string }>();
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    api(`/adminViewCoach/${coachid}`).then(setPayload);
  }, [coachid]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{payload?.profileInfo?.NAME}</h1>
      <p>{payload?.profileInfo?.ABOUT}</p>
      <h3>Certifications</h3>
      {(payload?.certifications || []).map((cert: any) => (
        <p key={cert.ID}>{cert.CERTIFICATION} {cert.APPROVED ? '(approved)' : '(pending)'}</p>
      ))}
      <Link href={`/admin/coach/${coachid}/clients`}>View clients</Link>
    </div>
  );
}
