# Architecture

Bastion is a two-sided marketplace: freelance coaches sell recurring training plans, and clients subscribe after receiving a personal offer. One Express API backs two web clients.

```
frontend-vue  (hash routes, same origin as the API)
frontend-next (path routes on :3000)
        \         /
         \       /
          api Express
              |
     SQLite or MySQL
              |
     Stripe Connect, SES, S3
```

## Roles

- **Client** — completes the intake survey, creates an account, reviews offers, subscribes, messages the assigned coach, and can leave a review.
- **Coach** — joins by invite, completes onboarding (profile, certifications, memberships), receives assigned open clients, sends offers, and manages active plans.
- **Admin** — internal staff. Lists coaches and clients, assigns coaches to unmatched clients, invites coaches by email, and can cancel a subscription.

`USER.ISCOACH`, `USER.ADMIN`, and `USER.COACHID` encode role and the client’s current coach. `COACHID = -1` means unmatched.

## Authentication

Clients store a 30-character token from `/login` or `/createAccount` in a `token` cookie and send it on every authenticated request as the `token` header. The API looks up `USER.TOKEN`. There is no JWT and no server-side session store.

Password reset tokens live in `RESETPASSWORD` for 30 minutes. Coach invites reuse the account token in `/#/coachJoin/:token`.

## Marketplace sequence

1. Admin invites a coach (`/adminInviteCoach`) or a coach self-registers.
2. The coach finishes `/coachJoin`, which writes profile tables and starts Stripe Connect onboarding.
3. When Connect payouts become active, `/whCapability` creates a Stripe product and prices for each `PRICINGS` row.
4. Admin assigns unmatched clients to coaches (`ASSIGNCOACHES`).
5. The coach sends an offer (`OFFERS` + greeting `MESSAGES`).
6. The client accepts (`/startCoaching`): a 7-day trial subscription with a 20% application fee, `transfer_data.destination` set to the coach’s connected account, and a `PLAN` row.
7. `/whSubscriptionEnded` deactivates the plan and clears `USER.COACHID`.

## Web clients

Both clients speak the same REST surface (relative paths such as `/login` and `/getOffers`).

- **Vue** is a CDN-loaded SPA in `frontend-vue/`. Vue Router uses hash mode so refreshes do not need a history fallback. Express serves these files from `/`.
- **Next.js** is a React App Router client in `frontend-next/`. It uses path URLs (`/dashboard`, `/coach/dashboard`) and `NEXT_PUBLIC_API_URL` for the API origin.

Role redirects after login send coaches to `/coach/dashboard` (Vue: `/#/coach/dashboard`) and admins to `/admin/dashboard`.
