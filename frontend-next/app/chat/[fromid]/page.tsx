'use client';

import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

type Message = { ID: number; FROMID: number; TOID: number; MESSAGE: string };

export default function ChatPage() {
  const { fromid } = useParams<{ fromid: string }>();
  const { profile } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [info, setInfo] = useState<{ NAME: string; PROFILEPICTURE: string } | null>(null);
  const [text, setText] = useState('');

  async function load() {
    const [thread, chatInfo] = await Promise.all([
      api<Message[]>(`/getMessages/${fromid}`),
      api<{ NAME: string; PROFILEPICTURE: string }>(`/getChatInfo/${fromid}`)
    ]);
    setMessages(thread);
    setInfo(chatInfo);
  }

  useEffect(() => {
    load().catch(() => setMessages([]));
  }, [fromid]);

  async function send(event: FormEvent) {
    event.preventDefault();
    await api('/sendMessage', { method: 'POST', body: JSON.stringify({ toID: Number(fromid), message: text }) });
    setText('');
    load();
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{info?.NAME}</h1>
      <div className="chatThread">
        {messages.map((msg) => (
          <p key={msg.ID} style={{ textAlign: msg.FROMID === profile?.ID ? 'right' : 'left' }}>{msg.MESSAGE}</p>
        ))}
      </div>
      <form onSubmit={send}>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="button b-button" type="submit">Send</button>
      </form>
    </div>
  );
}
