# Bastion

Bastion is a peer-to-peer freelance personal training marketplace. Vetted coaches publish subscription training plans, clients collect offers, and payments move coach-to-client through Stripe Connect. This repository is the web application that launched as the MVP for Bastion LLC (Desai Accelerator 2023 finalist; seed-funded).

## Core product flow

- Coaches join the platform through an invite and vetting process.
- Coaches create training plans as recurring subscriptions.
- Clients receive offers from coaches that include an introductory message and a suggested plan.
- Clients select a coach from the offers they have received and subscribe to that coach’s plan.
- Admin accounts (internal staff) can inspect coach↔client relationships and send coach invites by email.

## Billing and payments (Stripe Connect)

Clients pay coaches directly via Stripe Connect. Bastion takes an application fee during the payment flow. Payouts go to connected Express accounts rather than through an internal ledger, which keeps fund flows and compliance on Stripe’s Connect model while still supporting platform-level monetization.

## Tech stack

**Web clients**

- Vue 2 + Vue Router + Bulma (`frontend-vue`), served by the API as a hash-routed SPA
- Next.js + React (`frontend-next`), path-routed app that calls the same REST API

**API**

- Node.js + Express REST API (`api`)

**Database**

- Relational schema with interchangeable drivers:
  - SQLite (default in this repository)
  - Amazon RDS / MySQL (original deployment)
- Both drivers expose `initDB`, `dbGet`, `dbAll`, and `dbRun`, so route logic does not change when swapping storage.

Database diagram: https://dbdiagram.io/d/Bastion-Database-Schema-64322d058615191cfa8c6945

## Repository layout

- [`api/`](api/) — Express API, Stripe Connect, SES mail, and the host for the Vue client
- [`frontend-vue/`](frontend-vue/) — Vue 2 single-page application
- [`frontend-next/`](frontend-next/) — Next.js application
- [`docs/`](docs/) — architecture, API reference, schema, and local development

## Run locally

```bash
cp .env.example .env
npm install
npm run dev:api
```

The API listens on `http://localhost:8010` and serves the Vue client at the same origin (`/#/login`, `/#/dashboard`, …).

In a second terminal:

```bash
npm run dev:next
```

The Next.js client listens on `http://localhost:3000` and calls the API using `NEXT_PUBLIC_API_URL`.

SQLite is created automatically at `api/data/bastionfit.db`. Stripe and AWS keys are optional; without them the API records local stand-in billing IDs and skips outbound email/uploads.

```bash
npm test
```

See [docs/development.md](docs/development.md) for environment variables, roles, and a fuller walkthrough.
