'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { Popup } from '@/components/Popup';

export default function ResetPasswordPage() {
  const { resetToken } = useParams<{ resetToken: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await api('/resetPassword', { method: 'POST', body: JSON.stringify({ password, resetToken }) });
      setMessage('Password updated. You can log in now.');
      setOpen(true);
      window.setTimeout(() => router.push('/login'), 1500);
    } catch {
      setMessage('That reset link is invalid or expired.');
      setOpen(true);
    }
  }

  return (
    <div>
      <Popup open={open} message={message} onClose={() => setOpen(false)} />
      <h1 className="promptA">Reset password</h1>
      <form className="loginDesktop" onSubmit={onSubmit}>
        <input className="input b-textinput" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="button b-button create" type="submit">Reset</button>
      </form>
    </div>
  );
}
