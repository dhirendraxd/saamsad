# Implementation Roadmap: Post-Login Features

**Saved:** April 17, 2026

---

## 📍 Current State
- ✅ Landing page with hero + CTA
- ✅ Login/auth scaffold (client-side, mock-based)  
- ✅ Empty dashboard pages exist
- ❌ No logged-in features active yet
- ❌ No citizen-politician interaction

---

## 🎯 Build Goal

**Create the accountability loop end-to-end in MVP:**

```
Politician Posts Project 
    ↓
Citizens See It
    ↓
Citizens Verify Status + Provide Evidence
    ↓
Politician Responds to Citizens
    ↓
Loop Records Everything (Transparent)
```

---

## 📅 Recommended Build Sequence

### Week 1: Data + Layouts

**Goal:** Structure the data layer and build the UI container

**Tasks:**

1. **Extend Mock Data** (src/data/mockData.ts)
   - Add 5-10 realistic projects with different statuses
   - Add issue report examples
   - Expand politician profiles (biography, ward info)

2. **Update API Types** (src/lib/api/contracts.ts)
   - Add `IssueReport` interface
   - Add `ProjectVerification` interface
   - Add `Comment` interface

3. **Build Dashboard Shell** (src/app/dashboard/citizen/page.tsx)
   - Layout: header + stats + projects grid + issues list
   - Use mock data from queries
   - No interactivity yet

4. **Build Politician Profile Shell** (src/app/dashboard/politician/page.tsx)
   - Layout: profile card + stats + my projects list
   - No interactivity yet

**Output:** Pages look good but aren't interactive

---

### Week 2: Core Interactions

**Goal:** Make the core loop work end-to-end

**Tasks:**

1. **Issue Reporting** (src/app/dashboard/citizen/report-issue.tsx)
   - Form: title, description, location, image upload
   - On submit: add to localStorage/mock store
   - Show confirmation + redirect to issue list

2. **Project Creation** (src/app/dashboard/politician/create-project.tsx)
   - Form: title, description, timeline, status
   - On submit: add to localStorage/mock store
   - Show in "My Projects" list

3. **Project Detail & Verification** (src/app/project/[id]/page.tsx)
   - Show project info
   - Add verification buttons (Completed/In Progress/Delayed)
   - Show verification count + colors
   - Add comment section (read + write)

4. **Issue Detail** (src/app/issue/[id]/page.tsx)
   - Show issue details
   - Politician can link to project (mock response)
   - Citizens can add comments

5. **Activity Tracking** (src/app/dashboard/activity.tsx)
   - Show user's reported issues
   - Show user's verifications
   - Show user's comments

**Output:** Full loop works with mock data in localStorage

---

### Week 3: Polish & Notifications

**Goal:** Make the platform feel alive and addictive

**Tasks:**

1. **Progress Photos** 
   - Projects: add photo gallery section
   - Upload on project update

2. **Politician Response to Issues**
   - Politicians see all issues from their ward
   - Can respond with "We're addressing this in [Project X]"
   - Response appears on issue detail

3. **Activity Feed** (shared view)
   - Show: recent projects, verifications, comments
   - Chronological with user avatars
   - Creates social proof

4. **Mock Notifications**
   - Toast when politician responds
   - Toast when issue gets verified
   - Toast when project status changes

5. **Redirect Logic**
   - After login: Citizens → Dashboard; Politicians → Profile
   - After creating project: → "My Projects"
   - After reporting issue: → Issue list

**Output:** Platform feels active and responsive

---

## 🛠️ Technical Implementation Notes

### Data Persistence Strategy (MVP)
- **For MVP:** Store in localStorage under namespace `civic:user:*` and `civic:platform:*`
- **Later:** Replace with backend API calls via `src/lib/api/civicApi.ts`

### State Management
- Use `@tanstack/react-query` hooks (`useCivicQueries`)
- Local mutations write to localStorage
- Queries refetch on tab focus (simulates sync)

### Validation
- Use Zod schemas (already in project)
- Validate forms before submit
- Show errors inline

### File Structure
```
src/app/dashboard/
  ├── citizen/
  │   ├── page.tsx (dashboard)
  │   ├── report-issue.tsx
  │   └── activity.tsx
  └── politician/
      ├── page.tsx (profile)
      ├── create-project.tsx
      └── manage-issues.tsx

src/components/
  ├── ProjectCard.tsx (already exists)
  ├── IssueCard.tsx (new)
  ├── VerificationPanel.tsx (already exists)
  ├── CommentSection.tsx (new)
  └── ActivityFeed.tsx (already exists)

src/lib/api/
  ├── contracts.ts (add Issue, Verification types)
  └── queryKeys.ts (add issue, verification keys)
```

---

## 🎯 MVP Success Moments

After implementing, you should be able to:

1. **📱 As a Citizen:**
   - Log in → see dashboard with projects
   - Click project → verify it → add comment
   - Report issue → see it in my activity

2. **👔 As a Politician:**
   - Log in → see profile
   - Create project → verify it appears on dashboard
   - See citizen comment → respond

3. **🔄 As Observer:**
   - See the complete interaction:
     - Project posted by politician
     - Citizen verified + commented
     - Politician responded
     - All visible on project detail

---

## 🚀 Launch Checklist

Before showing to early users:

- [ ] All mock data feels realistic (use real ward names, project types)
- [ ] Forms are fast and clear
- [ ] Feedback is immediate (toast on success)
- [ ] No console errors
- [ ] Mobile layout works (test on phone browser)
- [ ] Core loop completes in <5 min (citizen flow)
- [ ] Politician can post project in <3 min
- [ ] Comments show real-time (at least simulated)

---

## 📝 Next Handoff

Once Phase 1 is working:

1. **Test with real users** (target: 2 citizens, 1 politician)
2. **Record their session** (what do they click? where do they get stuck?)
3. **Prioritize Phase 2** based on what they ask for (not what you assumed)

The accountability loop is your thesis. Everything else is supporting it.
