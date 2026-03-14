# CivicLedger

CivicLedger is a React + TypeScript web app for tracking political promises, monitoring project progress, and supporting community verification.

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
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

The local dev server runs at `http://localhost:8080`.

## Available Scripts

- `npm run dev`: start local development server.
- `npm run build`: create production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint checks.
- `npm run test`: run Vitest test suite once.
- `npm run test:watch`: run Vitest in watch mode.

## Project Layout

- `src/components`: reusable UI and feature components.
- `src/pages`: route-level screens.
- `src/lib`: auth, API contracts, and utilities.
- `src/hooks`: query and reusable React hooks.
- `src/data`: mock data used by the prototype.

## Build Verification

```sh
npm run lint
npm run build
```
