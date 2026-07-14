# Production analytics and attribution smoke checks

Run this procedure only at the production launch gate, after the launch owner has configured the real Cloudflare Web Analytics site and Tally form. The repository intentionally contains neither identifier. Until those public values are supplied to the production build, the correct result is no Cloudflare beacon and the Contact fallback instead of a form.

Keep indexing disabled until every production launch gate in issue #1 has passed. These checks do not authorize changing the canonical domain, enabling indexing, publishing credentials, or submitting sensitive data.

## Prerequisites

- Add `verranlabs.com` as the intended site in Cloudflare Web Analytics and copy the public site token from its browser snippet.
- Supply that site token to the production build as `PUBLIC_CLOUDFLARE_ANALYTICS_BEACON`. It must be 32 lowercase letters or digits. Never use a Cloudflare API token or API key.
- Supply the published Tally form identifier as `PUBLIC_TALLY_FORM_ID` and confirm the form has case-sensitive hidden fields for `offer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `referral`.
- Deploy the exact commit under launch review and record its commit SHA, deployment URL, deploy time, and reviewer.
- Use only synthetic, low-sensitivity test data. Do not upload or submit files, credentials, client data, export-controlled material, personal records, or protected details.

## Cloudflare pageview check

1. Open a new private browser window with developer tools recording Network requests.
2. Visit the production home route with this synthetic query, replacing the date with the check date:

   ```text
   ?utm_source=launch-smoke&utm_medium=manual&utm_campaign=production-gate-YYYYMMDD&utm_content=assessment-cta&utm_term=private-ai&referral=launch-gate
   ```

3. Visit Home, Private Agentic Workspace, Contact, and Privacy through the site's links. Confirm every route loads successfully and the Contact URL retains only the approved attribution fields plus its selected `offer`.
4. Confirm each page contains one deferred request for `https://static.cloudflareinsights.com/beacon.min.js`, its `data-cf-beacon` value contains only the expected public site token, and the script response succeeds.
5. Allow the pages to become hidden or close the tab so Core Web Vital reporting can flush. Confirm successful beacon ingestion requests to Cloudflare; do not manually call the ingestion endpoint.
6. After Cloudflare has processed the events, confirm its Web Analytics dashboard reports the production hostname, the visited page paths, pageviews, the available referring-site trend, and page-load performance data for the smoke window.

If the script or ingestion request is absent, stop. Confirm the deployed build received the public site token and that the configured Cloudflare site matches the production hostname. Do not substitute an API credential or weaken token validation.

## Tally attribution check

1. From the attributed production home page, select `Request a Private AI System Assessment` and inspect the Contact URL and embedded Tally URL.
2. Confirm `offer=enterprise-assessment` and all six synthetic attribution values are present. Add a harmless rejected parameter such as `email=must-not-forward@example.com` to the landing URL and confirm it is absent from both destinations.
3. Submit one clearly labelled launch-smoke inquiry using only the permitted low-sensitivity fields. Choose a manual-review outcome unless the separate scheduling smoke test is also authorized.
4. In Tally, locate the resulting submission and confirm the `offer`, UTM, and `referral` hidden-field values exactly match the browser values. Confirm no rejected landing parameter or sensitive content was captured.
5. Record the Tally response identifier and receipt time, then delete or retain the synthetic response according to the launch owner's test-data policy.

## Evidence and result

Record pass/fail for the Cloudflare script, beacon ingestion, dashboard page/path/referrer/performance trends, Tally field propagation, and rejected-parameter check. Attach evidence only in the approved launch record; never commit dashboard exports, identifiers, inquiry payloads, or credentials to this repository.

Any missing dashboard event, unexpected field, wrong hostname, failed script, or sensitive-data exposure blocks the production launch until corrected and rechecked.
