'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type ClientRow = { ID: number; NAME: string; PROFILEPICTURE: string; PLANID?: number };

export default function CoachClientsPage() {
  const [mine, setMine] = useState<ClientRow[]>([]);
  const [open, setOpen] = useState<ClientRow[]>([]);

  useEffect(() => {
    api<ClientRow[]>('/getMyClients').then(setMine).catch(() => setMine([]));
    api<ClientRow[]>('/getOpenClients').then(setOpen).catch(() => setOpen([]));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>My clients</h1>
      {mine.map((client) => (
        <Link key={client.ID} href={client.PLANID ? `/coach/viewActiveClient/${client.PLANID}` : `/coach/clientPreview/${client.ID}`}>
          <div className="box">{client.NAME}</div>
        </Link>
      ))}
      <h2>Open clients</h2>
      {open.map((client) => (
        <Link key={client.ID} href={`/coach/clientPreview/${client.ID}`}>
          <div className="box">{client.NAME}</div>
        </Link>
      ))}
    </div>
  );
}
