'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/session';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { token, logOut, flash, message, goDashboard } = useSession();
  const [hamburger, setHamburger] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= window.innerHeight);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setHamburger(false);
  }, [pathname]);

  return (
    <div id="app">
      <nav className={`navbar is-white ${isMobile ? 'b-navpadnew' : 'b-navpad-dnew'}`} role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          {isMobile ? (
            <Link className="navbar-item" href="/">
              <img src="/resources/bastionlight.png" alt="BastionFit" width={112} height={28} />
            </Link>
          ) : null}
          <a
            role="button"
            className={`navbar-burger ${hamburger ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded={hamburger}
            onClick={() => setHamburger((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        {!token ? (
          <div className={`navbar-menu ${hamburger ? 'is-active' : ''} ${isMobile ? 'b-navmenu' : ''}`}>
            <div className="navbar-start">
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''} ${pathname === '/' ? 'menuItemSelected' : ''}`} href="/">Home</Link>
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''} ${pathname === '/survey' ? 'menuItemSelected' : ''}`} href="/survey">Join</Link>
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''} ${pathname === '/login' ? 'menuItemSelected' : ''}`} href="/login">Login</Link>
            </div>
            {!isMobile ? (
              <Link className="navbar-item" href="/">
                <img src="/resources/bastionlight.png" alt="BastionFit" width={112} height={28} />
              </Link>
            ) : null}
            <div className="navbar-end">
              <a className={`navbar-item ${isMobile ? 'b-item' : ''}`} href="https://blog.bastionfit.com/">Blog</a>
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''}`} href="/about">About</Link>
              <a className={`navbar-item b-disabled ${isMobile ? 'b-item' : ''}`} onClick={() => flash('Coming soon.')}>Shop</a>
            </div>
          </div>
        ) : (
          <div className={`navbar-menu ${hamburger ? 'is-active' : ''} ${isMobile ? 'b-navmenu' : ''}`}>
            <div className="navbar-start">
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''} ${pathname === '/' ? 'tealcolor' : ''}`} href="/">Home</Link>
              <a className={`navbar-item ${isMobile ? 'b-item' : ''} ${pathname.includes('dashboard') ? 'tealcolor' : ''}`} onClick={goDashboard}>Dashboard</a>
              <a className={`navbar-item ${isMobile ? 'b-item' : ''}`} href="https://blog.bastionfit.com/">Blog</a>
            </div>
            {!isMobile ? (
              <Link className="navbar-item" href="/">
                <img src="/resources/bastionlight.png" alt="BastionFit" width={112} height={28} />
              </Link>
            ) : null}
            <div className="navbar-end">
              <Link className={`navbar-item ${isMobile ? 'b-item' : ''}`} href="/about">About</Link>
              <a className={`navbar-item b-disabled ${isMobile ? 'b-item' : ''}`} onClick={() => flash('Coming soon.')}>Shop</a>
              <a className={`navbar-item ${isMobile ? 'b-item' : ''}`} onClick={logOut}>Log Out</a>
            </div>
          </div>
        )}
      </nav>
      {message ? <div className="slide-message">{message}</div> : null}
      {children}
    </div>
  );
}
