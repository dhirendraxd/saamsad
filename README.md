# CivicLedger

CivicLedger is a civic accountability platform for tracking political promises, monitoring project progress, and supporting community verification.

## Tech Stack

- Vite
- Next.js App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```sh
npm install
npm run dev
```

The Vite development server runs at `http://localhost:8080`.

To run the parallel Next.js app-router setup:

```sh
npm run dev:next
```

The Next.js development server runs at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: start the Vite development server.
- `npm run dev:next`: start the Next.js development server.
- `npm run build`: create the Vite production build in `dist/`.
- `npm run build:next`: create the Next.js production build.
- `npm run preview`: serve the Vite production build locally.
- `npm run start:next`: serve the Next.js production build locally.
- `npm run lint`: run ESLint checks.
- `npm run test`: run Vitest test suite once.
- `npm run test:watch`: run Vitest in watch mode.

## Security Notes

- The current auth flow is still prototype-only and runs entirely on the client.
- The sign-in screen no longer collects passwords, because the app does not yet have a secure server-side authentication system.
- Production auth should move to server-issued, HttpOnly session cookies before connecting real user identities or protected APIs.

## Frontend-Only Workflow (Current)

- The app currently runs in frontend-only mode using local mock data.
- Queries read from `src/lib/api/civicApi.ts`, which is the single integration seam.
- When backend is ready, keep UI components unchanged and swap `civicApi` implementation to a real API adapter.

## Platform Direction

- CivicLedger is maintained as a hand-built product surface, not a builder-generated template.
- Template residue and unused scaffolding should be removed rather than carried forward.
- Runtime UI should stay focused on the components the app actually renders today.

## Project Layout

- `src/components`: reusable UI and feature components.
- `src/views`: route-level screens for both Vite and Next.js app routes.
- `src/app`: Next.js app-router entry files.
- `src/lib`: auth, API contracts, and utilities.
- `src/hooks`: query and reusable React hooks.
- `src/data`: mock data used by the prototype.

## Build Verification

```sh
npm run lint
npm run build
```
