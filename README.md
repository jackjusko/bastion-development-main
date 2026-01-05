#Pillar Coaching
==============

Pillar Coaching is an online, peer-to-peer training marketplace where vetted coaches publish subscription training plans and clients choose a coach via coach-submitted offers. The platform also supports admin accounts for Pillar employees to inspect coach/client relationships and invite new coaches to join.

This repository contains the full-stack application:
- Frontend: Vue 2 single-page application (Vue Router + Bulma + Axios)
- Backend: Express.js REST API
- Database: SQLite in this repository (Amazon RDS in production), behind a swappable driver layer with matching interfaces
- Payments: Stripe Connect (client-to-coach billing with a platform fee)


What this project demonstrates (technical)
------------------------------------------

1) Two-sided billing via Stripe Connect
   - Clients pay for a coach subscription through Stripe.
   - Coaches are paid through Connect while the platform takes an application fee (“fee off the top”).
   - Designed around Stripe’s subscription lifecycle (creation, renewal, cancellation, failed payments) and keeping application state in sync with Stripe events.

2) Marketplace-style matching via offers
   - Coaches can send offers to a client containing an introduction and a suggested subscription plan.
   - Clients select a coach by accepting one of the offers they receive, which starts the subscription.

3) Swappable persistence layer (SQLite <-> RDS)
   - Local development uses SQLite.
   - Production used Amazon RDS.
   - The RDS and SQLite drivers implement identical interfaces, allowing the backend to switch databases without changing calling code.


Core flows
----------

Coach onboarding + plan publishing
- A coach joins Pillar and is vetted (out-of-band).
- The coach completes Stripe Connect onboarding.
- The coach creates one or more subscription training plans.

Client acquisition via offers
- A client joins the platform.
- Coaches send offers to the client (intro statement + recommended plan).
- The client chooses a coach by accepting an offer and begins subscribing to that coach’s plan.

Billing & payouts (Stripe Connect)
- Subscription payments are collected from the client.
- Funds are routed to the coach through Connect.
- The platform collects an application fee.
- Stripe webhooks (or equivalent event handling) are used to reflect subscription state changes in the application.


Admin features
--------------

Admin accounts (Pillar employees) can:
- Explore coach/client relationships.
- Send invite emails to onboard new coaches.


Tech stack
----------

Frontend
- Vue 2
- Vue Router
- Bulma
- Axios

Backend
- Node.js
- Express.js

Database
- SQLite (in this repository)
- Amazon RDS (in production; same interface as SQLite driver)

Payments
- Stripe Connect


Database schema
---------------

Relational schema diagram:
https://dbdiagram.io/d/Bastion-Database-Schema-64322d058615191cfa8c6945


Notes
-----

- This README is intentionally focused on architecture and technical responsibilities (payments, subscriptions, driver abstraction) rather than providing a “getting started” guide.
- Credentials, keys, and operational configuration are intentionally not included here.
