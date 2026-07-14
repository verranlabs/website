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
- Private Agentic Workspace: the bounded $4,500 individual knowledge-worker offer
- Contact: one low-sensitivity qualification boundary for every offer path
- Privacy: permitted fields, prohibited submissions, processors, and retention

## Deployment

Pushes to `main` deploy through GitHub Actions to GitHub Pages. The initial Pages build uses the `/website` base path and is marked `noindex` until the custom `verranlabs.com` domain is connected.

The deploy workflow typechecks and runs the browser acceptance suite before the Pages build. The suite verifies both the default preview-safe build and an explicitly configured indexed build.

## Public configuration

Copy `.env.example` to `.env` when local integration values are needed. Every supported value is a public build-time identifier or destination; never put credentials, private tokens, or sensitive data in these variables.

The preview remains non-indexable by default. Indexing is enabled only when a valid HTTPS `PUBLIC_SITE_ORIGIN` and `PUBLIC_SITE_INDEXING=enabled` are supplied together.

When `PUBLIC_TALLY_FORM_ID` is absent, Contact shows a safe email fallback and asks visitors not to send files or sensitive details. Contact forwards only the approved `enterprise-assessment`, `workflow-review`, and `agentic-workspace` offer values plus the approved `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `referral` attribution parameters to matching Tally hidden fields. Internal navigation and offer calls to action preserve those approved values, while a route-specific offer takes precedence over an incoming landing-page offer. Arbitrary query names and offer values are not forwarded.

Cloudflare Web Analytics is disabled unless `PUBLIC_CLOUDFLARE_ANALYTICS_BEACON` contains the deliberately configured 32-character lowercase alphanumeric site token from Cloudflare's public browser snippet. Missing or invalid values emit no Cloudflare script. The site token is a public identifier, not a Cloudflare API token or API key; credentials do not belong in public configuration or the repository.

Founder proof remains honest when launch inputs are absent. Configure `PUBLIC_FOUNDER_HEADSHOT_URL` with the supplied professional photograph and `PUBLIC_LINKEDIN_URL` with the confirmed profile destination; each must be an HTTPS URL and is rendered independently. Until verified values are supplied, the site publishes a plain pending-verification state rather than a substitute portrait or guessed profile.

### Tally qualification contract

The published Tally form must:

- Begin with the four approved engagement paths and include case-sensitive hidden fields matching `offer` and the supported attribution parameters.
- Recognize `offer=agentic-workspace` as the preselected `$4,500 Private Agentic Workspace Setup` path.
- Recognize `offer=workflow-review` as the preselected `$2,500 AI Workflow Review` path.
- Collect only the permitted low-sensitivity fields documented on Contact and Privacy.
- Contain no file-upload or attachment block.
- Require the workspace buyer to acknowledge the published $4,500 fixed price before that branch can qualify for scheduling.
- Route an active enterprise opportunity with budget allocated or under review to `/contact/qualified/` after submission.
- Require an AI Workflow Review buyer to acknowledge the published $2,500 price before routing to `/contact/qualified/` after submission.
- Route a workspace inquiry that acknowledges the price and otherwise qualifies to `/contact/qualified/` after submission.
- Route exploratory, uncertain, price-unacknowledged, and otherwise unqualified inquiries to `/contact/received/` after submission.

The qualified completion route renders `PUBLIC_BOOKING_URL` when it is configured; the manual-review route never renders it. Browser tests exercise this integration contract with a boundary fixture. The real Tally branches, required price acknowledgement, upload prohibition, notifications, and Google booking destination still require live smoke tests during the production launch gate.

The production analytics and attribution checks are also deferred until a real beacon and form are deliberately configured. Follow the [production smoke-check procedure](docs/production-smoke-checks.md) at the launch gate; do not treat fixture-backed browser coverage as evidence that third-party dashboards received live data.

## Local Commands

```sh
npm run dev
npm run check
npm run build
npm run preview
npm test
```
