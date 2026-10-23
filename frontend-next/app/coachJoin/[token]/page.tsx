'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api, setToken } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function CoachJoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { refresh } = useSession();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    location: '',
    gender: 'Male',
    about: '',
    accountable: 'Weekly check-ins',
    compExperience: 'No'
  });

  useEffect(() => {
    if (token) {
      setToken(token);
      refresh();
    }
  }, [token, refresh]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      location: form.location,
      gender: form.gender,
      about: form.about,
      languages: [{ language: 'English', proficiency: 'Native' }],
      attributes: ['Empathetic', 'Goal Oriented', 'Evidence-Based'],
      specialties: ['Strength', 'Weight Loss', 'Nutrition'],
      accountable: form.accountable,
      compExperience: form.compExperience,
      comps: [],
      circumstances: ['None'],
      memberships: [
        { title: 'Basic Membership', description: '1-on-1 coaching', price: 100, features: ['Custom plan'] }
      ],
      certifications: [{ title: 'CPT', number: '', date: '' }]
    };
    const url = await api<string>('/coachJoin', { method: 'POST', body: JSON.stringify(payload) });
    window.location.href = url;
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="cjStart">Welcome to Bastion!</h1>
      <form onSubmit={onSubmit}>
        <input className="input b-textinput" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        <input className="input b-textinput" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        <input className="input b-textinput" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <select className="select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <textarea className="textarea" placeholder="About" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} required />
        <button className="button b-button" type="submit">Complete onboarding</button>
      </form>
    </div>
  );
}
