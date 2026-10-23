'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Popup } from '@/components/Popup';
import { api, setToken } from '@/lib/api';
import { SURVEY_STORAGE_KEY } from '@/lib/surveyQuestions';
import { useSession } from '@/lib/session';

export default function CreateAccountPage() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [open, setOpen] = useState(true);
  const [header, setHeader] = useState('Thank you!');
  const [message, setMessage] = useState('Thank you for completing the survey! In order to find a coach, the last step is to create your free account.');
  const showError = password !== '' && password2 !== '' && password !== password2;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== password2) return;
    const stored = window.sessionStorage.getItem(SURVEY_STORAGE_KEY);
    const surveyAnswers = stored ? JSON.parse(stored) : [{ prompt: 'What is your name?', type: 'input', inputAnswer: email, multiselectAnswer: '' }];
    try {
      const token = await api<string>('/createAccount', {
        method: 'POST',
        body: JSON.stringify({ email, password, isCoach: 0, surveyAnswers })
      });
      setToken(token);
      await refresh();
      setHeader('Your Information Has Been Submitted!');
      setMessage('We are gathering coaches for you and we will notify you when your options are ready in 1-2 days.');
      setOpen(true);
      window.setTimeout(() => router.push('/dashboard'), 1500);
    } catch {
      setHeader('An error has occured.');
      setMessage('A Bastion account with this email address already exists. Try logging in.');
      setOpen(true);
    }
  }

  return (
    <div>
      <Popup open={open} header={header} message={message} onClose={() => setOpen(false)} />
      <div>
        <h1 className="promptA">CREATE ACCOUNT</h1>
        <h1 className="underprompt">Please enter your information:</h1>
      </div>
      <form className="loginDesktop" onSubmit={onSubmit}>
        <input className="input b-textinput" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input b-textinput" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="input b-textinput" type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
        {showError ? <div className="showError">Passwords do not match</div> : null}
        <button className="button b-button create" type="submit">Create Account</button>
      </form>
    </div>
  );
}
