# Nivo

Your personal finance tracker for students and teenagers.

Track your monthly allowance, create budget branches, and record expenses.

## Tech stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Supabase (Auth, PostgreSQL, Row Level Security) — added in later steps
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the development server (Turbopack)
- `npm run build` — production build (Turbopack)
- `npm run lint` — run ESLint

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values
(URL and anon key from Project Settings > API).

## Note on native modules

`next.config.ts` lists `@tailwindcss/node` and `lightningcss` in
`serverExternalPackages` so Turbopack production builds can load their native
binaries on Windows. If the Turbopack build ever fails with a `lightningcss`
"module not found" error, fall back to `next build --webpack`.