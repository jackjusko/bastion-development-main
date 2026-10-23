'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="thanks">
      <h1>Thank you!</h1>
      <p>Your coaching plan is active. Head to your dashboard to message your coach.</p>
      <Link href="/dashboard"><button className="button b-button">Go to dashboard</button></Link>
    </div>
  );
}
