'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ApiError, api } from '@/lib/api';

export default function ClientPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [preview, setPreview] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [planID, setPlanID] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    api(`/clientPreview/${id}`).then(setPreview);
    api<any[]>('/offerPricings').then((rows) => {
      setPlans(rows);
      if (rows[0]) setPlanID(String(rows[0].ID));
    });
  }, [id]);

  async function sendOffer(event: FormEvent) {
    event.preventDefault();
    try {
      await api('/sendOffer', {
        method: 'POST',
        body: JSON.stringify({ clientID: Number(id), planID: Number(planID), greeting })
      });
      router.push('/coach/clients');
    } catch (err) {
      if (err instanceof ApiError && err.status === 307) {
        window.location.href = err.body;
      }
    }
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>{preview?.name}</h1>
      <img src={preview?.ProfilePicture} className="profileImage" alt="" />
      {(preview?.surveyAnswers || []).map((answer: any) => (
        <p key={answer.ID}>{answer.PROMPT}: {answer.INPUTANSWER || answer.MULTISELECTANSWER}</p>
      ))}
      <form onSubmit={sendOffer}>
        <select className="select" value={planID} onChange={(e) => setPlanID(e.target.value)}>
          {plans.map((plan) => (
            <option key={plan.ID} value={plan.ID}>{plan.TITLE} (${plan.PRICE})</option>
          ))}
        </select>
        <textarea className="textarea" placeholder="Greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
        <button className="button b-button" type="submit">Send offer</button>
      </form>
    </div>
  );
}
