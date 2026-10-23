'use client';

import Link from 'next/link';

export function MenuRow({ href, onClick, children }: { href?: string; onClick?: () => void; children: React.ReactNode }) {
  const inner = (
    <div style={{ width: '100%', cursor: 'pointer' }} className="columns is-mobile drop" onClick={onClick}>
      <div className="column">{children}</div>
      <div className="column is-narrow">
        <i className="fa-solid fa-arrow-right" />
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function ProfileHero({ src, title }: { src?: string; title: string }) {
  return (
    <>
      <img src={src || '/resources/default.png'} className="profileImage" alt="" />
      <div className="underProfilePic">
        <div className="profileText">{title}</div>
      </div>
    </>
  );
}
