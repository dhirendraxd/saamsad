# Samsad Context and Guidelines

## Purpose of This File
This document is the main product context for Samsad.
Use it as the source of truth for design, product decisions, and implementation direction.

## Platform Concept
Samsad is a civic accountability and transparency platform where political promises are tracked as public records.
Instead of relying on speeches and memory, the platform uses timelines, project data, and community verification.

Core idea: make governance records easy to follow.

- Promises become entries.
- Projects become timelines.
- Citizens become verifiers.

## Core Purpose
The platform is designed to solve three systemic problems.

### 1) Broken Memory Problem
Election promises are often forgotten over time.
Samsad stores promises and maps them to trackable projects.

### 2) Transparency Gap
Citizens often cannot see what is happening in their area.
Samsad provides clear visibility into local projects and progress.

### 3) Civic Education Gap
Many citizens want to participate but do not have practical civic literacy.
Samsad includes a civic education hub to explain governance, rights, and institutions.

## Main Users

### Citizens
Residents who monitor development and verify projects.

Citizens can:
- View politicians in their ward.
- Track local and national development projects.
- Upload evidence (photos, documents, reports).
- Verify project progress.
- Comment on updates.
- Learn governance through the education hub.

Rule:
- Citizens can interact only inside their own ward.
- Citizens can view public data from any region.

### Politicians
Verified candidates or elected representatives.

Politicians can:
- Publish manifesto promises.
- Create and manage development projects.
- Post progress updates.
- Upload transparency documents.
- Respond to citizen feedback.

Result:
- Performance is publicly visible and measurable.

## Identity Verification
To prevent fake accounts and impersonation:

Users provide:
- National ID or citizenship ID.
- Name.
- Ward or municipality.

System behavior:
- Check against candidate and public official records.
- If verified as candidate/official, set role to politician.
- Otherwise keep role as citizen.

## Core System Components

### Promise Tracking System
Manifesto promises are parsed into structured projects.

Each project must include:
- Title.
- Description.
- Location.
- Start date.
- Expected completion date.
- Progress updates.
- Evidence uploads.

### Development Project Tracker
Each project has a dedicated public page with:
- Progress timeline.
- Update log.
- Citizen feedback.
- Evidence gallery.

### Citizen Verification System
Ward residents can verify project status as:
- Completed.
- In progress.
- Delayed.
- Not started.

Multiple confirmations increase confidence and credibility.

### Evidence Upload System
Both citizens and politicians can upload:
- Photos.
- Documents.
- Reports.
- Location proof.

### Accountability Score System
Each politician receives public scores derived from measurable activity.

Primary metrics:
- Accountability Score.
- Credibility Points.
- Engagement Score.
- Transparency Rating.

Primary inputs:
- Promises completed.
- Delayed or failed projects.
- Citizen verification outcomes.
- Transparency disclosures.

### Transparency Documents
Politicians can publish voluntary disclosures, such as:
- Campaign expenses.
- Asset declarations.
- Funding sources.
- Policy reports.

Badges and recognition examples:
- Open Governance Badge.
- Transparency Leader.
- Community Engagement Award.

### Civic Education Hub
Learning topics include:
- Local government structure.
- Election systems.
- Public budgeting.
- Citizen rights.
- Policy-making process.

## Platform Structure
Minimal page architecture for clarity and scale:

- Homepage.
- Explore.
- Project Detail.
- Region Explorer.
- Civic Education Hub.
- Account Hub.

### Account Hub
Single unified profile + dashboard with role-aware interface.

Tabs:
- Overview.
- Projects.
- Activity.
- Transparency.
- Settings.

### Explore
Users can browse:
- Politicians.
- Projects.
- Transparency leaders.

Politician cards should show:
- Name.
- Constituency.
- Accountability score.
- Project completion rate.

### Region Explorer
Navigation hierarchy:
- Province.
- District.
- Municipality.
- Ward.

Each ward view should show:
- Local politicians.
- Development projects.
- Completion rates.
- Citizen activity.

### Project Detail Page
Every promise-linked project page includes:
- Project description.
- Timeline.
- Evidence gallery.
- Citizen verification results.
- Comments and review activity.

## Platform Data Flow
Operational flow:

1. Users register and pass identity checks.
2. Politicians publish promises and projects.
3. Projects receive updates and documentation.
4. Citizens verify progress and upload evidence.
5. Score engine recalculates public accountability metrics.
6. Citizens explore regional data and civic education content.

## Visual and Brand Guidelines

### Color Intent
- Blue = trust, stability, authority (dominant brand color).
- Green = growth, sustainability, positive action.
- Amber = caution and delay states.
- Red = failure, risk, blocked outcomes.

### Core Palette (Recommended)
- Primary Blue: `hsl(220 65% 28%)`
- Deep Blue: `hsl(220 65% 18%)`
- Positive Green: `hsl(152 55% 42%)`
- Positive Green Foreground: `hsl(0 0% 100%)`
- Warning Amber: `hsl(38 92% 50%)`
- Danger Red: `hsl(0 72% 51%)`
- Neutral Background: `hsl(0 0% 98%)`
- Neutral Card: `hsl(0 0% 100%)`
- Body Foreground: `hsl(220 20% 14%)`

### Gradient and Fade System
Use gradients and soft fades heavily for hero regions, score highlights, and status surfaces.

Recommended gradient tokens:
- `--gradient-civic-hero: linear-gradient(135deg, hsl(220 65% 28%) 0%, hsl(220 65% 18%) 70%)`
- `--gradient-civic-trust: linear-gradient(135deg, hsl(220 65% 32%) 0%, hsl(220 65% 22%) 100%)`
- `--gradient-civic-progress: linear-gradient(135deg, hsl(152 55% 46%) 0%, hsl(152 55% 34%) 100%)`
- `--gradient-civic-mix: linear-gradient(120deg, hsl(220 65% 28%) 0%, hsl(220 65% 20%) 55%, hsl(152 55% 42%) 100%)`

Recommended fade/overlay tokens:
- `--fade-blue-soft: hsl(220 65% 28% / 0.10)`
- `--fade-blue-strong: hsl(220 65% 28% / 0.22)`
- `--fade-green-soft: hsl(152 55% 42% / 0.12)`
- `--fade-green-strong: hsl(152 55% 42% / 0.22)`

### UI Style Notes
- Prefer clean cards and dashboard layouts with clear hierarchy.
- Keep status communication color-driven and consistent.
- Use subtle depth (shadows + fades), not heavy visual noise.
- Use gradients to reinforce state and intent, not decoration only.

Team preference notes:
- CTA and badge edges should prefer square corners (`rounded-none`) over pill shapes.
- Footer links should stay minimal and relevant.
- Hover accent can use subtle brown-red (`#7A3A30`) when needed.

## Long-Term Vision
Grow Samsad into a trusted national transparency layer where voters can evaluate leaders using public records.

Before elections, each profile should make it easy to inspect:
- Promises made.
- Promises completed.
- Project delays and failures.
- Transparency disclosures.
- Citizen trust trends.

Expected impact:
- Political performance becomes visible, measurable, and searchable.

## Philosophical Core
If software can track code changes publicly with history and accountability, governance can track political promises the same way.

Short version:
Politics with version history.
