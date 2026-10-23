'use client';

import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminViewClientPage() {
  const { clientid } = useParams<{ clientid: string }>();
  const [preview, setPreview] = useState<any>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    api(`/clientPreview/${clientid}`).then(setPreview);
    api<any[]>('/adminGetCoaches').then(setCoaches);
  }, [clientid]);

  async function assign(event: FormEvent) {
    event.preventDefault();
    await api('/adminAssignCoaches', { method: 'POST', body: JSON.stringify({ clientID: Number(clientid), coaches: selected }) });
  }

  async function cancel() {
    await api('/adminCancelSubscription', { method: 'POST', body: JSON.stringify({ clientID: Number(clientid) }) });
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{preview?.name}</h1>
      <form onSubmit={assign}>
        {coaches.map((coach) => (
          <label key={coach.ID}>
            <input type="checkbox" checked={selected.includes(coach.ID)} onChange={(e) => {
              setSelected(e.target.checked ? [...selected, coach.ID] : selected.filter((id) => id !== coach.ID));
            }} />
            {coach.NAME}
          </label>
        ))}
        <button className="button b-button" type="submit">Assign coaches</button>
      </form>
      <button className="button" onClick={cancel}>Cancel subscription</button>
    </div>
  );
}
