'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminCoachClientsPage() {
  const { coachid } = useParams<{ coachid: string }>();
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    api(`/adminViewCoachClients/${coachid}`).then(setPayload);
  }, [coachid]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{payload?.NAME}&apos;s clients</h1>
      {(payload?.CLIENTS || []).map((client: any) => (
        <div className="box" key={client.ID}>{client.NAME} {client.ACTIVE ? '(active)' : '(ended)'}</div>
      ))}
    </div>
  );
}
