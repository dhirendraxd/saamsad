# MVP Feature Prioritization

## 🎯 MVP Goal
**Activate the core accountability loop** with minimal features that create momentum for both citizen and politician adoption.

---

## 📋 Phase 1: Bootstrap (Week 1-2) — Minimum Viable Loop

### Phase 1A: Citizen Entry Point (Essential)

| Feature | Why First | Technical Lift | Impact |
|---------|-----------|-----------------|--------|
| **Local Area Dashboard** | Users need to see *why* the platform matters before engaging | Medium | **HIGH** — Sets context for all actions |
| **Browse Projects** | Primary citizen touchpoint; builds trust in platform | Low (use mock data) | **HIGH** — Social proof |
| **View Politicians** | Shows accountability target; motivates verification | Low | **Medium** |

**Why these first:**
- Citizens arrive → immediately see local work → trust platform exists
- Low code lift (mostly UI + mock data)
- Creates the "reason to come back"

---

### Phase 1B: Minimal Interaction (First Loop Activation)

| Feature | Why | Technical | Impact |
|---------|-----|-----------|--------|
| **Issue Reporting** (Basic) | Citizens need a *way to participate* | Medium | **CRITICAL** — Activates loop |
| **Project Status Verification** (Toggle only) | Simple citizen action | Easy | **CRITICAL** — Closes loop |
| **Comments on Projects** | Signals community engagement | Easy (UI component) | **High** — Social proof |

**Why these:**
- Smallest meaningful citizen actions
- Together they complete the accountability loop
- Comments create social proof (more engagement visible = more trust)

---

### Phase 1C: Politician Profile Setup (Attraction)

| Feature | Why | Technical | Impact |
|---------|-----|-----------|--------|
| **Politician Profile Page** | Politicians see their public profile | Easy | **Medium** — Launch bait |
| **Create Project** (Structured form) | Politicians post their first commitment | Medium | **CRITICAL** — Creates content |
| **Project Status Options** (Enum dropdown) | Simple update mechanism | Easy | **High** — Shows commitment progress |

**Why these:**
- Politicians need *one path* to post work
- Should take <2 min to create first project
- Creates the "inventory" citizens verify

---

## ⚡ Phase 1 MVP Feature List (Recommended Build Order)

### Backend/Data Layer
1. **[15 min]** Update `mockData.ts` with more realistic project statuses and politician profiles
2. **[30 min]** Add issue report type to `mockData.ts`
3. **[15 min]** Update API query keys in `queryKeys.ts`

### UI - Shared (Both Roles)
4. **[1 hr]** Dashboard card components (project cards, politician cards)
5. **[30 min]** Status badge + color system for projects
6. **[30 min]** Comment component (list + form)

### Citizen UI
7. **[1.5 hr]** Local Area Dashboard page (layout + empty states)
8. **[1 hr]** Project Detail page with comment section
9. **[1 hr]** Issue Report form (basic: title, description, location, 1 photo)
10. **[45 min]** Issue Report list view ("My Issues")
11. **[30 min]** Project verification toggle/buttons

### Politician UI
12. **[1.5 hr]** Politician Profile page
13. **[1 hr]** Create Project form (title, description, timeline, status)
14. **[45 min]** Project Management list ("My Projects")

### Auth/UX
15. **[30 min]** Redirect logic: citizen after login → Dashboard; politician after login → Profile
16. **[30 min]** Navigation updates (show appropriate sections based on role)

**Total Phase 1 Estimate:** ~12 hours of work

---

## ⏭️ Phase 2: Strengthen Loop (Week 3-4)

After Phase 1 works end-to-end, add depth:

| Feature | Why | When |
|---------|-----|------|
| **Progress Photos on Projects** | Citizens want visual proof; politicians want to show work | After basic loop works |
| **Politician Response to Issues** | Close the loop: politicians acknowledge citizen reports | After issues accumulate |
| **Activity Feed** (personal) | Show users what *they've* done (engagement driver) | With comments built |
| **Notifications System** (mock) | Keep users coming back | Final polish |
| **Evidence Gallery** (project detail) | Aggregate proof photos into one view | After photo uploads work |

---

## 🚀 Phase 3: Engagement Amplification (Week 5+)

- **Performance Dashboard** (politician completion %)
- **Ward Comparison** (cross-area stats)
- **Explore Other Wards** (expand awareness)
- **Email Notifications** (out-of-app re-engagement)
- **Public Sharing** (project links, social)

---

## 🎯 MVP Success Criteria

After Phase 1:

- ✅ A citizen logs in → sees their ward → can report one issue OR verify one project
- ✅ A politician logs in → can create a project → citizens see it
- ✅ Platform records: 1 issue OR 1 verification OR 1 comment
- ✅ The accountability loop is *clearly visible* (even with 1 action)

---

## 💡 Why This Order?

1. **Citizen first** = audience for politicians
2. **View before act** = understanding precedes participation
3. **Simplest actions first** = low friction, high adoption
4. **Loop closure** = one complete cycle proves the concept
5. **Politician stakes** = need something to show off (projects)

---

## 🔄 Why This Is Better Than Feature Creep

**Bad:** Build everything → complex → launch late → users confused

**Good:** Build core loop → confirm it works → expand based on real user behavior

After Phase 1, you'll know:
- Do citizens actually verify projects?
- Do politicians actually create them?
- Which features do users ask for?

Then Phase 2 addresses *real* gaps, not guesses.

---

## 📝 Technical Implementation Notes

- **Mock data:** Keep growing `mockData.ts` with realistic examples (more politicians, more projects)
- **Forms:** Use Zod validation (already in project)
- **Queries:** Extend `useCivicQueries` hook as you add features
- **Auth:** Stay with client-side localStorage (upgrade in Phase 2)
- **Database:** Plan it now, implement after Phase 1 validation

You're not delaying real backend—you're validating the UX first.
