Pillar Coaching
==============

Pillar Coaching is an online marketplace-style platform for personal training, centered on vetted coaches and subscription-based training plans. This repository contains the web application that served as the MVP for the initial launch of an early-stage startup named Bastion LLC (Desai Accelerator 2023 finalist; seed-funded). The name Bastion is still being used by one of the initial cofounders for his personal training program, and so this has been renamed to Pillar Coaching.

Core Product Flow
-----------------
- Coaches join the platform through an invite + vetting process.
- Coaches create training plans as recurring subscriptions.
- Clients receive offers from coaches that include an introductory message and a suggested plan.
- Clients select a coach from the offers they’ve received and subscribe to that coach’s plan.
- Admin accounts (for internal staff) can inspect coach↔client relationships and send coach invites by email.

Billing & Payments (Stripe Connect)
-----------------------------------
A key technical component of the system is two-sided payments:
- Clients pay coaches directly via Stripe Connect.
- Platform fees are taken as an application fee during the payment flow.
- Payouts to coaches are handled through connected accounts rather than via internal ledger payouts.

This approach keeps fund flows and compliance responsibilities aligned with Stripe’s Connect model while still supporting platform-level monetization.

Tech Stack
----------
Frontend
- Vue 2 + Vue Router
- Bulma for styling
- Axios for API access
- Implemented as a single-page application (SPA)

Backend
- Node.js + Express.js REST API

Database
- Relational schema with interchangeable drivers:
  - Amazon RDS (original deployment)
  - SQLite (used in this repository)
- The RDS and SQLite drivers expose identical interfaces, enabling swapping without changing the surrounding application logic.

Database diagram:
https://dbdiagram.io/d/Bastion-Database-Schema-64322d058615191cfa8c6945

Repository Notes
----------------
- This repo reflects the MVP-era implementation and is organized as a typical SPA + API service.
- Configuration here targets a local SQLite-backed environment to keep the repository self-contained.
