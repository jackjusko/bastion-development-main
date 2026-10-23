'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Row = { ID: number; NAME: string; PROFILEPICTURE: string };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Row[]>([]);
  const [open, setOpen] = useState<Row[]>([]);

  useEffect(() => {
    api<Row[]>('/adminGetClients').then(setClients).catch(() => setClients([]));
    api<Row[]>('/adminGetOpenClients').then(setOpen).catch(() => setOpen([]));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Clients</h1>
      {clients.map((client) => (
        <Link key={client.ID} href={`/admin/client/${client.ID}`}>
          <div className="box">{client.NAME}</div>
        </Link>
      ))}
      <h2>Unassigned</h2>
      {open.map((client) => (
        <Link key={client.ID} href={`/admin/client/${client.ID}`}>
          <div className="box">{client.NAME}</div>
        </Link>
      ))}
    </div>
  );
}
