'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SiteFooter } from '@/components/SiteFooter';

const slideItems = [
  {
    title: 'CUSTOM EXERCISE & NUTRITION PLANS',
    description: 'Your coach will craft the perfect exercise and nutrition plan for your goals. They will constantly make sure you are on track and adjust the plan as needed.',
    image: '/resources/homeassets/icon-upward.svg'
  },
  {
    title: 'BUILDING LIFE LONG HABITS',
    description: 'Your coach will help you build sustainable habits and tools that you can use for the rest of your life to be successful in fitness with OR without a coach.',
    image: '/resources/homeassets/icon-dumbell.svg'
  },
  {
    title: 'MONITORING AND ACCOUNTABILITY',
    description: 'Your coach will check-in with you frequently to get feedback and hold you accountable. You can also get in contact with them anytime when you need them.',
    image: '/resources/homeassets/icon-monitor.svg'
  }
];

const coaches = [
  { name: 'Megan H.', feature: 'Goal Oriented', major: 'Weight Loss and Strength', image: '/resources/homeassets/coach-megan.png' },
  { name: 'Lucas H.', feature: 'Empathetic', major: 'Holistic Wellness', image: '/resources/homeassets/coach-lucas.jpg' },
  { name: 'Jordan C.', feature: 'Tough Love', major: 'Weight Loss', image: '/resources/homeassets/coach-jordan.jpg' },
  { name: 'Jesse V.', feature: 'Tough Love', major: 'Weight Loss', image: '/resources/homeassets/coach-sebastien.jpg' },
  { name: 'Steven Y.', feature: 'Goal Oriented', major: 'Weight Loss and Strength', image: '/resources/homeassets/randomguy2.png' }
];

const clients = [
  {
    name: 'Kaitlin',
    job: 'Coach',
    comment: "Bastion provides me with the tools to track my clients' progress, communicate effectively, and tailor workouts and nutrition plans to their specific needs. The personalized nutrition advice has been a game-changer. I feel absolutely amazing.",
    image: '/resources/homeassets/client-woman2.jpg'
  },
  {
    name: 'Michael',
    job: 'Athletics / Trainer',
    comment: 'Bastion connected me with an amazing coach who understood my goals and designed a training program tailored to my needs. The personalized nutrition advice has been a game-changer, and I feel more energetic and confident than ever before',
    image: '/resources/homeassets/randomguy.png'
  },
  {
    name: 'James',
    job: 'Trainer',
    comment: "Balancing a demanding job and family life, I struggled to prioritize my health and fitness. That's when I discovered Bastion. The platform matched me with a dedicated coach who has been a game-changer in my fitness journey. Bastion has been a total game-changer.",
    image: '/resources/homeassets/client-man.jpg'
  }
];

export default function HomePage() {
  const [clientIndex, setClientIndex] = useState(0);
  const [coachIndex, setCoachIndex] = useState(0);
  const visibleClients = [0, 1, 2].map((offset) => clients[(clientIndex + offset) % clients.length]);
  const visibleCoaches = [0, 1, 2].map((offset) => coaches[(coachIndex + offset) % coaches.length]);

  return (
    <div>
      <div className="homeGradient" />
      <section className="light-bg homeHero" style={{ paddingBottom: '2rem' }}>
        <div className="my-container hero-container">
          <div className="columns is-align-items-center">
            <div className="column is-three-fifths left-side">
              <h1 className="has-text-black">The Right Coach Is Everything.</h1>
              <h2 className="has-text-black">
                Match with a specialized coach. <br />
                Accelerate your progress. <br />
                Become your best self.
              </h2>
              <div className="is-flex buttons">
                <Link href="/survey"><button className="primary-button">Find your Coach</button></Link>
                <Link href="/about">
                  <button className="secondary-button">
                    Learn More
                    <img src="/resources/homeassets/arrow-up-right.svg" alt="" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="column is-relative is-visible-desktop">
              <img className="dots-narrow" src="/resources/homeassets/dots-narrow.svg" alt="" />
              <img className="dots-wide" src="/resources/homeassets/dots-wide.svg" alt="" />
              <div className="video-wrapper">
                <video src="/resources/homeassets/hero.mp4" autoPlay loop muted />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark-bg homeFeatured" style={{ position: 'sticky', zIndex: 10 }}>
        <div className="is-flex is-align-items-center featured-wrapper">
          <div className="column is-one-third">
            <p className="is-uppercase has-text-white heading-normal">Featured On</p>
          </div>
          <div className="column">
            <img className="celsius-logo" src="/resources/homeassets/logo-celsius.svg" alt="Celsius" />
            <img className="michigan-logo" src="/resources/homeassets/logo-michigan-daily.svg" alt="The Michigan Daily" />
          </div>
        </div>
      </section>

      <section className="how-bastion-works light-bg homeHow">
        <div className="my-container is-relative">
          <h2 className="mobile-title">How Bastion Works</h2>
          <div className="my-cards is-relative">
            {slideItems.map((item) => (
              <div key={item.title} className="is-flex my-card">
                <div className="is-fullwidth is-fullheight bastion-card-content">
                  <div>
                    <h3 className="card-header is-uppercase has-text-weight-bold">{item.title}</h3>
                    <p className="is-secondary-font card-description">{item.description}</p>
                  </div>
                  <img src={item.image} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="is-clipped dark-bg homeCoaches">
        <div className="my-container">
          <div className="content-wrapper">
            <div className="has-text-white">
              <h2 className="has-text-weight-bold">The best coaches for your best self.</h2>
              <p className="subheader">Nationally certified in personal training, nutrition, behavior change, and years of experience with beginners to world-class athletes.</p>
              <Link href="/survey">
                <button className="button">View All Coaches</button>
              </Link>
            </div>
            <div className="slider desktopCoachSlider">
              <div className="coaches-wrapper">
                {visibleCoaches.map((coach) => (
                  <div key={coach.name} className="coach-card">
                    <img src={coach.image} alt={coach.name} />
                    <div className="text-container">
                      <p className="is-size-5 has-text-weight-bold has-text-black pb-3">{coach.name}</p>
                      <p className="has-text-weight-semibold description2">{coach.feature}</p>
                      <p className="has-text-weight-semibold description2">{coach.major}</p>
                      <Link className="is-uppercase has-text-weight-medium has-text-centered pt-5 is-block" href="/survey">View Profile</Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="arrows-container is-flex is-justify-content-center">
                <img src="/resources/homeassets/arrow-left-short.svg" alt="Left" className="mx-4" onClick={() => setCoachIndex((i) => (i + coaches.length - 1) % coaches.length)} />
                <img src="/resources/homeassets/arrow-right-short.svg" alt="Right" className="mx-4" onClick={() => setCoachIndex((i) => (i + 1) % coaches.length)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="light-bg homeWhy">
        <div className="my-container">
          <div className="columns is-variable is-2">
            <div className="column is-one-third main-column">
              <h2 className="has-text-weight-bold">Why Bastion</h2>
              <p className="has-text-weight-semibold has-text-black subheader">Highly credible coaches. Best in-class personal training App</p>
            </div>
            <div className="column is-one-third py-0-mobile">
              <div className="has-text-white feature-card">
                <h3 className="blue-line">Evidence-Based</h3>
                <p>Many of our coaches have a Bachelor’s or higher degree in exercise science, psychology, biomechanics, health, and more.</p>
              </div>
              <div className="has-text-white feature-card">
                <h3 className="purple-line">Personalized</h3>
                <p>Our coaches meet you where you are at. You can only workout once a week? No problem.</p>
              </div>
            </div>
            <div className="column is-one-third py-0-mobile">
              <div className="has-text-white feature-card">
                <h3 className="yellow-line">Holistic</h3>
                <p>Fitness is not just about exercise. It comes from mindset, nutrition, and everyday habits.</p>
              </div>
              <div className="has-text-white feature-card">
                <h3 className="green-line">Goal Oriented</h3>
                <p>Coaches set mini goals every step of the way so you can develop key habits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark-bg is-relative homeClients">
        <div className="client-container">
          <h2 className="has-text-white has-text-weight-bold is-uppercase">What Clients Say About Us</h2>
          <div className="slider">
            <div className="clients-wrapper">
              {visibleClients.map((client) => (
                <div key={client.name} className="client-card">
                  <div className="client-avatar-wrapper is-relative">
                    <img src={client.image} alt={client.name} className="avatar" />
                  </div>
                  <div>
                    <p className="name">{client.name}</p>
                    <p className="jobtitle">{client.job}</p>
                    <p className="comment">{client.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="is-justify-content-center controls-container">
            <button className="prev is-size-2 has-text-black" onClick={() => setClientIndex((i) => (i + clients.length - 1) % clients.length)}>&lt;</button>
            <button className="is-size-2 has-text-black" onClick={() => setClientIndex((i) => (i + 1) % clients.length)}>&gt;</button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
