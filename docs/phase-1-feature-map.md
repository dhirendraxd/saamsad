# Phase 1 Feature Map (No DB)

Status: Approved scope
Constraint: No database integration, no backend wiring, no external services
Data mode: Mock + localStorage only

## 1. Phase 1 Product Goal
Enable one complete accountability cycle inside the app:

1. Politician creates/updates a project
2. Citizen views and verifies project status
3. Citizen reports local issue with optional evidence
4. Politician responds to issue/comment
5. Actions appear in user activity views

If this loop works reliably, Phase 1 is successful.

## 2. In Scope vs Out of Scope

In scope:
- Role-based post-login dashboards (citizen and politician)
- Issue reporting (create + list + detail)
- Project verification actions
- Comments/discussion on projects
- Politician project creation and update
- Politician responses to citizen issues/comments
- Basic activity history per user

Out of scope for Phase 1:
- Database
- Real authentication provider
- File storage service (S3, Blob, etc.)
- Realtime sockets
- Notification service (email/push)
- Advanced moderation/admin workflows

## 3. Shared Data Contract Additions

Extend types in src/lib/api/contracts.ts:

- IssueReport
  - id, title, description, ward, municipality, locationText
  - category, severity, status
  - authorId, authorName
  - evidence (string[]) as local file preview URLs/paths
  - linkedProjectId (optional)
  - createdAt, updatedAt

- ProjectVerification
  - id, projectId, userId, userName
  - vote: completed | in-progress | delayed | not-started
  - note (optional), evidence (string[])
  - createdAt

- Response
  - id, parentType: issue | comment
  - parentId, responderId, responderName
  - message
  - linkedProjectId (optional)
  - createdAt

- ActivityEvent
  - id, actorId, actorRole
  - type (issue.created, project.verified, comment.created, project.created, response.created, project.updated)
  - referenceId, referenceType
  - summary
  - createdAt

## 4. Citizen Features (Phase 1)

### 4.1 Citizen Dashboard
Route: src/app/dashboard/citizen/page.tsx
Backed by: existing AccountHub targetRole=citizen

Must show:
- Ward summary strip (ward, municipality)
- Ongoing local projects (cards)
- Recent issue updates (latest list)
- Quick actions: Report Issue, Verify Projects, My Activity

Acceptance:
- Citizen can reach all key actions in one click
- Empty states render cleanly when no local data

### 4.2 Issue Reporting
Routes:
- New: src/app/dashboard/citizen/report-issue/page.tsx
- New: src/app/issue/[id]/page.tsx

Fields:
- title, description, locationText, category, severity
- optional evidence upload (local preview only)

Behavior:
- Save issue to localStorage-backed layer
- Add activity event issue.created
- Show issue in citizen activity and politician issue list

Acceptance:
- Valid submit creates visible issue immediately
- Form validation blocks empty/invalid fields

### 4.3 Project Verification
Route: src/app/project/[id]/page.tsx (already exists shell)

Actions:
- Vote status: completed | in-progress | delayed | not-started
- Optional note + evidence

Behavior:
- Save/update user verification record for project
- Recompute project verification summary on page
- Add activity event project.verified

Acceptance:
- One user has one active vote per project (editable)
- Summary updates instantly after submit

### 4.4 Comments & Discussion
Route: src/app/project/[id]/page.tsx

Actions:
- Citizen adds comment to project
- Citizen sees politician responses

Behavior:
- Persist comments locally
- Add activity event comment.created

Acceptance:
- New comments appear without page reload
- Basic chronological ordering is stable

### 4.5 Personal Activity View
Route: src/app/dashboard/citizen/activity/page.tsx

Show:
- Reported issues
- Verifications
- Comments
- Timeline events

Acceptance:
- Most recent actions first
- Empty and loading states are clear

## 5. Politician Features (Phase 1)

### 5.1 Politician Dashboard/Profile
Route: src/app/dashboard/politician/page.tsx
Backed by: existing AccountHub targetRole=politician

Must show:
- Profile metrics (project count, completion ratio)
- My projects list
- Ward issue inbox snapshot

Acceptance:
- Politician sees own project inventory and pending issues

### 5.2 Project Creation & Management
Routes:
- New: src/app/dashboard/politician/create-project/page.tsx
- New: src/app/dashboard/politician/projects/page.tsx

Actions:
- Create project (title, description, timeline, category, location)
- Update project status/progress

Behavior:
- Save project locally
- Add activity events project.created and project.updated

Acceptance:
- Created project appears in citizen local dashboard for same ward
- Status updates reflect on project detail page

### 5.3 Respond to Citizens
Routes:
- src/app/issue/[id]/page.tsx
- src/app/project/[id]/page.tsx

Actions:
- Reply to issue thread
- Reply to project comments
- Optionally link response to a project

Behavior:
- Save response locally
- Add activity event response.created

Acceptance:
- Response is visible to both roles immediately

## 6. API/State Layer Mapping (No DB)

Use existing seam: src/lib/api/civicApi.ts

Implement via local storage adapter under mockApi path:
- createIssueReport(input)
- listIssuesByWard(ward)
- fetchIssueById(id)
- createOrUpdateVerification(input)
- listVerificationsByProject(projectId)
- createComment(input)
- createResponse(input)
- createProject(input)
- updateProject(input)
- listActivityByUser(userId)

Query hooks to add in src/hooks/queries/useCivicQueries.ts:
- useIssuesByWardQuery(ward)
- useIssueQuery(id)
- useCreateIssueMutation()
- useProjectVerificationsQuery(projectId)
- useUpsertProjectVerificationMutation()
- useCreateCommentMutation()
- useCreateResponseMutation()
- useCreateProjectMutation()
- useUpdateProjectMutation()
- useUserActivityQuery(userId)

## 7. Local Storage Keys (Temporary)

Use stable names:
- civic.issues
- civic.verifications
- civic.responses
- civic.comments
- civic.activity
- civic.projects.userCreated

Rules:
- Keep a version field for migration safety
- Parse defensively and fallback to defaults
- Never block UI on malformed local data

## 8. UI Components to Reuse vs Add

Reuse:
- src/components/ProjectCard.tsx
- src/components/VerificationPanel.tsx
- src/components/ActivityFeed.tsx
- src/components/EvidenceGallery.tsx

Add:
- src/components/IssueReportForm.tsx
- src/components/IssueCard.tsx
- src/components/IssueThread.tsx
- src/components/ProjectVerificationForm.tsx
- src/components/ResponseComposer.tsx

## 9. Delivery Plan (Feature Slices)

Slice 1: Citizen Issue Reporting
- form + mutation + list + detail + activity event

Slice 2: Politician Project Create/Update
- create form + manage list + status updates

Slice 3: Project Verification + Comments
- verification form + aggregate + comment thread

Slice 4: Politician Response Loop
- response composer + issue/project thread integration

Slice 5: Activity Pages
- citizen activity + politician activity summary

Each slice should be demonstrable independently.

## 10. Definition of Done for Phase 1

Phase 1 is complete when:
- Citizen can report issue and verify project
- Politician can create/update project and respond
- Both users can see discussion history and action traces
- All data survives refresh via localStorage
- No DB/backend dependency exists in runtime path

This gives you a full product demo loop while keeping architecture ready for backend integration later.
