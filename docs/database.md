# Database

Drivers live under `api/modules/`. `database.js` selects SQLite (default) or MySQL from `DATABASE_DRIVER`. Both implement:

| Method | Meaning |
|--------|---------|
| `initDB()` | Open the connection (SQLite also applies `api/schema/schema.sql`) |
| `dbGet(sql, params)` | First row, or `0` when missing |
| `dbAll(sql, params)` | Array of rows |
| `dbRun(sql, params)` | `1` on success, `0` on error |

Visual schema: https://dbdiagram.io/d/Bastion-Database-Schema-64322d058615191cfa8c6945

## Tables

- **USER** — accounts: credentials, `TOKEN`, `ISCOACH`, `ADMIN`, `COACHID`, profile fields
- **SURVEY** — intake answers captured at registration
- **PRICINGS** / **PRICINGS_FEATURES** — coach membership tiers
- **PRICINGS_STRIPE** — maps a pricing row to Stripe product/price ids
- **BANKING** — Stripe customer id (clients) or Connect account id (coaches)
- **COACH_PRODUCT** — coach → Stripe product after Connect activation
- **PLAN** — active or ended coaching engagement + subscription id
- **OFFERS** — pending coach→client offers
- **ASSIGNCOACHES** — admin triage: which coaches may contact which unmatched clients
- **MESSAGES** — chat (`FROMID`, `TOID`, `MESSAGE`)
- **REVIEWS** — client reviews and optional before/after image URLs
- **CERTIFICATIONS** — coach credentials, `APPROVED` flag
- **COACHLANGUAGES**, **COACHATTRIBUTES**, **COACHSPEC**, **COACHACCOUNTABLE**, **COACHCOMP**, **COACHCIRC** — onboarding questionnaire
- **RESETPASSWORD** — short-lived reset tokens (`EXPIRES` is a unix timestamp)

SQLite files default to `api/data/bastionfit.db` and are gitignored. MySQL settings are read from `MYSQL_*` environment variables; no hostnames are stored in source.
