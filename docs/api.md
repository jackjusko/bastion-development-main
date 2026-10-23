# HTTP API

All routes are registered on the Express app in `api/routes/`. Authenticated routes read `req.headers.token`. Admin routes also require `USER.ADMIN = 1`. JSON bodies are limited to 50mb. Listed POST paths must include every field in `api/modules/requestValidator.js` or they return 400.

Success tokens are returned as a raw 30-character string, not JSON.

## Auth (`authRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/createAccount` | No | Register; persist survey; seed coach pricings; Stripe customer; thank-you email; returns token. 409 if email exists. Body: `email`, `password`, `isCoach`, `surveyAnswers`. |
| POST | `/login` | No | Returns token or 401. Body: `email`, `password`. |
| POST | `/forgotPassword` | No | Always 200. Sends reset mail if the email exists. Body: `email`. |
| POST | `/resetPassword` | No | Set password from `resetToken` (30 min). Body: `password`, `resetToken`. |
| GET | `/requestPasswordReset` | User | Email a reset link to the logged-in user. |

## Profile (`profileRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/updateProfilePicture` | Token in SQL | Crop/upload avatar. Body: `picture` (data URL), `options`. |
| POST | `/updateAbout` | Token in SQL | Update bio. Body: `about`. |
| GET | `/getProfileInfo` | Token | `ID`, `NAME`, `ADMIN`, `PROFILEPICTURE`, `LOCATION`, `ISCOACH`, `COACHID`, `ABOUT`. 401 if unknown token. |

## Pricing (`pricingRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/getPricings` | User | Coach tiers plus `FEATURES`. |
| POST | `/updatePricings` | User (must own `COACHID`) | Update tier and Stripe price. |
| GET | `/createPricing` | User | New $100 tier and Stripe price if `COACH_PRODUCT` exists. |

## Clients, offers, subscribe (`clientRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/getOpenClients` | User (coach) | Admin-assigned unmatched clients without an open offer from this coach. |
| GET | `/getMyClients` | User (coach) | Active clients with `PLANID`. |
| POST | `/updateCertifications` | User (coach) | Replace certifications (pending approval). |
| GET | `/getCertifications` | User (coach) | Certification list. |
| GET | `/clientPreview/:clientID` | No | Survey + name for the coach UI. |
| GET | `/offerPricings` | User (coach) | Plans for the offer picker. |
| POST | `/sendOffer` | User (coach) | Offer + greeting; 307 + onboarding URL if payouts are not ready. |
| GET | `/getOffers` | User (client) | Raw `OFFERS` rows. |
| GET | `/getOffersDisplay` | User (client) | Enriched offer cards. |
| GET | `/getOffer/:offerid` | No | Full offer, coach profile, features, certifications. |
| GET | `/getCoachDisplay/:coachid` | No | Public coach card. |
| POST | `/startCoaching` | User (client) | Payment-method check; Stripe subscription; `PLAN` + `COACHID`. 307 if no card. |
| GET | `/getCoachNameString/:coachid` | No | Short display name. |
| GET | `/viewActiveClient/:planid` | No | Plan, client, pricing for the coach view. |

## Coach onboarding (`coachRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/coachJoin` | User (invited coach) | Profile + pricings + certifications; returns Stripe Connect onboarding URL. 409 if already onboarded. |

## Messaging (`messageRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/getMessageHeaders` | User | Inbox preview rows. |
| GET | `/getMessages/:chatID` | User | Thread with that user id. |
| GET | `/getChatInfo/:userID` | No | Name and avatar. |
| POST | `/sendMessage` | User | Insert message. Body: `toID`, `message`. |

## Reviews (`reviewRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/leaveReview` | User | Review plus optional before/after images. |
| GET | `/getReviews/:coachid` | No | Reviews with reviewer info. |

## Admin (`adminRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/adminGetCoaches` | Admin | All coaches. |
| GET | `/adminViewCoach/:coachid` | Admin | Profile + certifications. |
| GET | `/adminViewCoachClients/:coachid` | Admin | Clients via `PLAN`. |
| GET | `/adminGetClients` | Admin | Non-coach, non-admin users. |
| GET | `/adminGetOpenClients` | Admin | Clients without a coach. |
| POST | `/adminAssignCoaches` | Admin | `ASSIGNCOACHES` rows. Body: `coaches`, `clientID`. |
| POST | `/adminCancelSubscription` | Admin | Deactivate plan; clear `COACHID`. Body: `clientID`. |
| POST | `/adminInviteCoach` | Admin | Register coach and email invite. Body: `email`, `password`, `name`. |

## Stripe (`stripeRoutes.js`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/getStripeSetupURL` | User | Checkout setup session (add a card). |
| GET | `/getStripeBalance` | User | Connect balance for coaches. |
| GET | `/getStripeLoginURL` | User | Express dashboard login. |
| GET | `/getStripePortalURL` | User | Customer billing portal. |
| POST | `/whCapability` | No (webhook) | Connect capability active → product + `PRICINGS_STRIPE`. |
| POST | `/whSubscriptionEnded` | No (webhook) | End plan; unlink client coach. |

## Other

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/blog*` | No | Proxy to `blog.bastionfit.com`. |
| GET | static files | No | Vue client from `frontend-vue/`. |
