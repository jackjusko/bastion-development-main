'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function EditProfilePage() {
  const { profile, refresh, flash } = useSession();
  const [about, setAbout] = useState('');
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    setAbout(profile?.ABOUT || '');
    if (profile?.ISCOACH) {
      api<any[]>('/getCertifications').then(setCerts).catch(() => setCerts([]));
    }
  }, [profile]);

  async function saveAbout(event: FormEvent) {
    event.preventDefault();
    await api('/updateAbout', { method: 'POST', body: JSON.stringify({ about }) });
    await refresh();
    flash('Profile updated.');
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>My Profile</h1>
      <img src={profile?.PROFILEPICTURE} className="profileImage" alt="" />
      <form onSubmit={saveAbout}>
        <textarea className="textarea" value={about} onChange={(e) => setAbout(e.target.value)} />
        <button className="button b-button" type="submit">Save about</button>
      </form>
      {profile?.ISCOACH ? (
        <div>
          <h3>Certifications</h3>
          {certs.map((cert) => (
            <p key={cert.ID}>{cert.CERTIFICATION}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
