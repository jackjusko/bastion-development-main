# Local development

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
cp .env.example .env
npm install
```

`DATABASE_DRIVER=sqlite` is the default. The API creates `api/data/bastionfit.db` on first boot.

## Run

| Command | What it starts |
|---------|----------------|
| `npm run dev:api` | Express on `PORT` (8010). Vue client at `http://localhost:8010/#/` |
| `npm run dev:next` | Next.js on 3000, API calls go to `NEXT_PUBLIC_API_URL` |
| `npm test` | API unit/integration tests, Next unit tests, then Playwright |

Stripe (`STRIPE_SECRET_KEY`) and AWS (`AWS_ACCESS_KEY_ID`) are optional. Empty Stripe keys record local ids (`cus_local_…`, `sub_local_…`) and treat payouts/payment methods as ready. Empty AWS keys skip SES and S3 (avatars stay `/resources/default.png`).

To use MySQL instead:

```
DATABASE_DRIVER=mysql
MYSQL_HOST=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
```

## Environment

See [`.env.example`](../.env.example). `CORS_ORIGIN` must include the Next.js origin so the `token` header is accepted. The Vue client is same-origin and does not need CORS.

## Tests

API tests spin up an isolated SQLite file and drive HTTP with Supertest. Mail is mocked. Playwright covers Vue home/login and Next login → dashboard / offers against the same API.

```bash
npm run test:api
npm run test:next
```

## Seeded admin (optional)

There is no fixture user in the repo. After creating an account through `/createAccount`, mark it admin in SQLite:

```sql
UPDATE USER SET ADMIN = 1 WHERE EMAIL = 'you@example.com';
```
