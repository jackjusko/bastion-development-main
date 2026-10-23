'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function ViewCoachPage() {
  const { profile } = useSession();
  const [coach, setCoach] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.COACHID || profile.COACHID === -1) return;
    api(`/getCoachDisplay/${profile.COACHID}`).then(setCoach);
    api(`/getReviews/${profile.COACHID}`).then(setReviews);
  }, [profile]);

  if (!coach) {
    return <div style={{ padding: '2rem' }}>No assigned coach yet.</div>;
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <img src={coach.profileInfo?.PROFILEPICTURE} className="profileImage" alt="" />
      <h1>{coach.profileInfo?.NAME}</h1>
      <p>{coach.profileInfo?.ABOUT}</p>
      <h3>Reviews</h3>
      {reviews.map((review, i) => (
        <p key={i}>{review.REVIEW}</p>
      ))}
    </div>
  );
}
