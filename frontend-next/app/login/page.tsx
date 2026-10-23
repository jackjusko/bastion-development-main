'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Popup } from '@/components/Popup';
import { api, setToken } from '@/lib/api';
import { dashboardPath } from '@/lib/auth';
import { useSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Incorrect email or password - please try again.');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const token = await api<string>('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setToken(token);
      const profile = await refresh();
      setMessage('Welcome back to Bastion! You will now be redirected to the dashboard.');
      setOpen(true);
      window.setTimeout(() => router.push(dashboardPath(profile)), 1500);
    } catch {
      setMessage('Incorrect email or password - please try again.');
      setOpen(true);
    }
  }

  return (
    <div>
      <Popup open={open} message={message} onClose={() => setOpen(false)} />
      <div>
        <h1 className="promptA">Login</h1>
        <h1 className="underprompt">Sign in to your Bastion account.</h1>
      </div>
      <form className="loginDesktop" onSubmit={onSubmit}>
        <input className="input b-textinput" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input b-textinput" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="button b-button create" type="submit">Login</button>
      </form>
      <div className="alreadyjoined">
        <Link href="/forgotPassword"><span style={{ color: 'var(--teal)' }}>Forgot password?</span></Link>
      </div>
      <div className="alreadyjoined">
        Don&apos;t have an account? <Link href="/survey"><span style={{ color: 'var(--teal)' }}>Join Today</span></Link>
      </div>
    </div>
  );
}
