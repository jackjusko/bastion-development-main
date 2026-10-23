'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Header = { name: string; profilePicture: string; message: string; fromID: number };

export default function MessageHomePage() {
  const [headers, setHeaders] = useState<Header[]>([]);

  useEffect(() => {
    api<Header[]>('/getMessageHeaders').then(setHeaders).catch(() => setHeaders([]));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Messages</h1>
      {headers.map((row) => (
        <Link key={row.fromID} href={`/chat/${row.fromID}`}>
          <div className="box">
            <img src={row.profilePicture} alt="" width={48} />
            <strong>{row.name}</strong>
            <p>{row.message}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
