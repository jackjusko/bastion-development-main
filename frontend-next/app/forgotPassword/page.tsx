'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { Popup } from '@/components/Popup';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await api('/forgotPassword', { method: 'POST', body: JSON.stringify({ email }) });
    setOpen(true);
  }

  return (
    <div>
      <Popup open={open} message="If that email matches a Bastion account, we sent a reset link." onClose={() => setOpen(false)} />
      <h1 className="b-acctop" style={{ fontSize: '1.25rem', fontWeight: 500, maxWidth: 600, margin: '0 auto 2rem auto', textAlign: 'center' }}>
        Enter your email below, and we&apos;ll send you a link to reset your password if the email corresponds to a valid Bastion account.
      </h1>
      <form className="loginDesktop" onSubmit={onSubmit}>
        <input className="input b-textinput" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="button b-button create" type="submit">Send reset link</button>
      </form>
    </div>
  );
}
