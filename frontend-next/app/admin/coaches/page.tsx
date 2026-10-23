'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Row = { ID: number; NAME: string; PROFILEPICTURE: string };

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Row[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function load() {
    setCoaches(await api<Row[]>('/adminGetCoaches'));
  }

  useEffect(() => {
    load().catch(() => setCoaches([]));
  }, []);

  async function invite(event: FormEvent) {
    event.preventDefault();
    await api('/adminInviteCoach', { method: 'POST', body: JSON.stringify({ email, password, name }) });
    setEmail('');
    setPassword('');
    setName('');
    load();
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Coaches</h1>
      <form onSubmit={invite} className="box">
        <h3>Invite coach</h3>
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Temp password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button b-button" type="submit">Send invite</button>
      </form>
      {coaches.map((coach) => (
        <Link key={coach.ID} href={`/admin/coach/${coach.ID}`}>
          <div className="box">{coach.NAME}</div>
        </Link>
      ))}
    </div>
  );
}
