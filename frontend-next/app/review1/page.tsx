'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function ReviewPage() {
  const { flash } = useSession();
  const [review, setReview] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await api('/leaveReview', { method: 'POST', body: JSON.stringify({ review }) });
    flash('Thanks for the review.');
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Leave a review</h1>
      <p>The Bastion team and the coaches would love to hear what you have to say!</p>
      <form onSubmit={onSubmit}>
        <textarea className="textarea" value={review} onChange={(e) => setReview(e.target.value)} />
        <button className="button b-button" type="submit">Submit</button>
      </form>
    </div>
  );
}
