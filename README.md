# Verran Labs Website

The public Verran Labs marketing site, built with Astro, TypeScript, and Tailwind CSS.

The current site leads with the Private AI System Assessment for defense contractors and regulated technical teams that need a credible path from sensitive internal knowledge to a production private-AI system.

## Stack

- Astro for static-first marketing pages
- TypeScript for typed page data
- Tailwind CSS for responsive styling
- Playwright for production-build browser acceptance tests
- Verran Labs brand assets in `public/assets/`

The site uses restrained components, clear states, consistent controls, and reusable design tokens without turning the static marketing site into a client-side application.

## Published routes

- Home: enterprise positioning and the Private AI System Assessment
- Contact: one low-sensitivity qualification boundary for every offer path
- Privacy: permitted fields, prohibited submissions, processors, and retention

The Private Agentic Workspace route is added by its dedicated implementation ticket.

## Deployment

Pushes to `main` deploy through GitHub Actions to GitHub Pages. The initial Pages build uses the `/website` base path and is marked `noindex` until the custom `verranlabs.com` domain is connected.

The deploy workflow typechecks and runs the browser acceptance suite before the Pages build. The suite verifies both the default preview-safe build and an explicitly configured indexed build.

## Public configuration

Copy `.env.example` to `.env` when local integration values are needed. Every supported value is a public build-time identifier or destination; never put credentials, private tokens, or sensitive data in these variables.

The preview remains non-indexable by default. Indexing is enabled only when a valid HTTPS `PUBLIC_SITE_ORIGIN` and `PUBLIC_SITE_INDEXING=enabled` are supplied together.

When `PUBLIC_TALLY_FORM_ID` is absent, Contact shows a safe email fallback and asks visitors not to send files or sensitive details. Contact forwards `offer` and the approved `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, and `referral` attribution parameters to matching Tally hidden fields. Workflow Review calls to action preserve those attribution parameters from Home; arbitrary query values are not forwarded.

### Tally qualification contract

The published Tally form must:

- Begin with the four approved engagement paths and include case-sensitive hidden fields matching the supported attribution parameters.
- Collect only the permitted low-sensitivity fields documented on Contact and Privacy.
- Contain no file-upload or attachment block.
- Route an active enterprise opportunity with budget allocated or under review to `/contact/qualified/` after submission.
- Require an AI Workflow Review buyer to acknowledge the published $2,500 price before routing to `/contact/qualified/` after submission.
- Route exploratory, uncertain, price-unacknowledged, and otherwise unqualified inquiries to `/contact/received/` after submission.

The qualified completion route renders `PUBLIC_BOOKING_URL` when it is configured; the manual-review route never renders it. Browser tests exercise this integration contract with a boundary fixture. The real Tally branches, required price acknowledgement, upload prohibition, notifications, and Google booking destination still require live smoke tests during the production launch gate.

## Local Commands

```sh
npm run dev
npm run check
npm run build
npm run preview
npm test
```
