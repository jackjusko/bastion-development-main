'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

export default function AboutPage() {
  return (
    <div>
      <section className="light-bg" style={{ padding: '3rem 1.5rem' }}>
        <div className="my-container">
          <h1 className="has-text-weight-bold">About Bastion</h1>
          <p>Bastion strives to support your long-term success in fitness with or without a coach by your side.</p>
          <p>Bastion coaching is more focused on education, accountability, and sustainable habits than a drop-in gym session.</p>
          <h3>What it Means to be a Bastion Coach</h3>
          <p>Bastion holds coaches to the highest standards. Coaches are invited and vetted before they can work with clients on the marketplace.</p>
          <p>Bastion allows coaches to work at any time, at home, or on the go. You choose how many clients you have and how you structure your plans.</p>
          <Link href="/survey"><button className="button b-button">Find your Coach</button></Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
