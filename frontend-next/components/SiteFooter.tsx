'use client';

import Link from 'next/link';

export function SiteFooter() {
  return (
    <div className="dark-bg homeFooter">
      <div className="my-container">
        <div className="columns">
          <div className="column column-center-all logo-and-social">
            <img src="/resources/homeassets/light-logo.svg" alt="Bastion Logo" className="logo" />
            <div>
              <img src="/resources/homeassets/icon-facebook.svg" alt="" />
              <img src="/resources/homeassets/icon-twitter.svg" alt="" className="px-4" />
              <img src="/resources/homeassets/icon-ig.svg" alt="" />
            </div>
          </div>
          <div className="is-hidden-touch column is-flex is-justify-content-space-between">
            <div className="category-block is-flex is-flex-direction-column">
              <p>Company</p>
              <Link href="/about">About Us</Link>
            </div>
            <div className="category-block is-flex is-flex-direction-column">
              <p>Services</p>
              <Link href="/survey">Coaches</Link>
            </div>
            <div className="category-block is-flex is-flex-direction-column">
              <p>Training</p>
              <Link href="/about">Learn more</Link>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <p className="has-text-centered copyright">©2023 Bastion. All rights reserved</p>
          <div className="is-hidden-touch is-flex terms-gap">
            <a href="/resources/pp.pdf">Privacy & Policy</a>
            <a href="/resources/tos.pdf">Terms & Condition</a>
          </div>
        </div>
      </div>
    </div>
  );
}
