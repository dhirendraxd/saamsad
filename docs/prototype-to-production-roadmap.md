# CivicLedger Prototype to Production Roadmap

## Goal
Move CivicLedger from static mock experience to production-ready civic infrastructure with typed contracts, API-backed data, and verified identity/auth.

## Current Baseline
- Frontend architecture is solid and modular.
- Data is mostly static from `src/data/mockData.ts`.
- React Query is installed and provider is mounted, but data fetching is not broadly integrated.
- Auth/identity flow is not yet implemented.

## Target Architecture
- API-first data layer with typed contracts.
- Query hooks per domain (projects, politicians, comments, regions, education, auth).
- Auth foundation with identity verification flow and role-aware session state.
- Progressive replacement of mock data with backend services.

## Proposed Folder Structure

```text
src/
  app/
    ...
  views/
    ...
  lib/
    api/
      contracts.ts
      queryKeys.ts
      mockApi.ts
      httpClient.ts
    auth/
      authTypes.ts
      authService.ts
      AuthContext.tsx
  hooks/
    queries/
      useCivicQueries.ts
  components/
    ...
```

## API Contract Blueprint
Use shared request/response contracts with `zod` schemas and inferred TypeScript types.

Core resources:
- `AuthSession`
- `IdentityRegistrationInput`
- `Politician`
- `Project`
- `Comment`
- `EducationTopic`
- `RegionTree`

Suggested backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/politicians`
- `GET /api/politicians/:id`
- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/projects/:id/comments`
- `GET /api/regions`
- `GET /api/education/topics`

## Query Hook Strategy
Create query hooks with stable keys and dedicated stale times:
- `usePoliticiansQuery()`
- `useProjectsQuery()`
- `useProjectQuery(id)`
- `useCommentsByProjectQuery(projectId)`
- `useRegionsQuery()`
- `useEducationTopicsQuery()`
- `useAuthSessionQuery()`

Mutation hooks:
- `useRegisterIdentityMutation()`
- `useSignInMutation()`
- `useSignOutMutation()`

## Auth and Identity Strategy
Identity fields:
- National ID/citizenship ID
- Legal name
- Ward/municipality

Verification behavior:
- Check official/candidate registries (or verified upstream source).
- If verified as elected/candidate, set role `politician`.
- Otherwise set role `citizen`.

Session behavior:
- Store access token + user profile.
- Role-aware UI in Account Hub and write permissions.
- Revalidate session on app start.

## Migration Order

### Phase 1: Foundation
- Add typed contracts and query key registry.
- Add mock async API adapter with the same shape as future backend responses.
- Add auth context + storage-backed session scaffolding.

### Phase 2: Route Integration
- Move `Explore` and `ProjectDetail` to query hooks.
- Move `AccountHub` role handling to auth context.
- Keep mock adapter as backend substitute.

### Phase 3: Backend Swap
- Add `httpClient.ts` and environment-based API base URL.
- Replace mock adapter calls with real API calls incrementally.
- Keep hook signatures stable to avoid large UI rewrites.

### Phase 4: Security and Governance
- Add route guards and role-based UI/actions.
- Add server-side validation and audit logs for verification/evidence events.
- Add anti-spam and evidence moderation workflows.

### Phase 5: Quality and Reliability
- Expand test coverage:
  - unit tests for data mappers and score logic
  - component tests for key pages/states
  - auth flow integration tests
- Add observability and error telemetry.

## Data and Domain Priorities
Highest-priority production entities:
1. Identity + Session
2. Projects + Milestones + Verification votes
3. Politician profile + transparency documents
4. Region hierarchy
5. Education content

## Definition of Done for Production Readiness
- All core pages powered by API responses, not static data imports.
- Auth session and role enforcement are live.
- Typed contracts are shared between frontend and backend.
- Core civic workflows are tested and observable.
- Lint/build/tests are green in CI.
