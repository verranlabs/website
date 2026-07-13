# Verran Labs Website

The public Verran Labs marketing site, built with Astro, TypeScript, and Tailwind CSS.

The current homepage leads with agentic RAG and private AI systems: the strongest of the original six landing-page directions because it gives Verran Labs a specific, technically credible point of view while leaving room for workflow automation, secure deployment, and production handoff services.

## Stack

- Astro for static-first marketing pages
- TypeScript for typed page data
- Tailwind CSS for responsive styling
- Verran Labs brand assets in `public/assets/`

The page borrows shadcn/ui principles: restrained components, clear states, consistent controls, and reusable design tokens. It does not turn the marketing site into a React app.

The other prototype content remains in the data file for future positioning work, but only the selected Agentic RAG homepage is published.

## Deployment

Pushes to `main` deploy through GitHub Actions to GitHub Pages. The initial Pages build uses the `/website` base path and is marked `noindex` until the custom `verranlabs.com` domain is connected.

## Local Commands

```sh
npm run dev
npm run build
npm run preview
```
