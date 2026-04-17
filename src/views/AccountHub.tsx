"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  FolderOpen,
  Layers,
  LogIn,
  MapPin,
  MessageSquare,
  Plus,
  Settings,
  Shield,
  Upload,
  User,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import type { ActivityItem } from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { Link, Navigate, useLocation } from "@/lib/router";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";
import type { Project } from "@/lib/api/contracts";
import {
  addProjectComment,
  createIssue,
  listActivityByUser,
  listIssuesByWard,
  listNotificationsByUser,
  listVerificationsByProject,
  markAllNotificationsRead,
  pushActivity,
  pushNotification,
  respondToIssue,
  upsertVerification,
  type IssueReport,
  type NotificationItem,
  type VerificationVote,
} from "@/lib/localParticipation";

type Role = "citizen" | "politician";
type Tab = "overview" | "projects" | "activity" | "transparency" | "settings";

const DEMO_CITIZEN = {
  userId: "demo-citizen",
  role: "citizen" as const,
  name: "Demo Citizen",
  ward: "Ward 5",
  municipality: "Kathmandu",
  verified: false,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
};

const DEMO_POLITICIAN = {
  userId: "demo-politician",
  role: "politician" as const,
  name: "Demo Politician",
  ward: "Ward 5",
  municipality: "Kathmandu",
  verified: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
};

const voteLabel: Record<VerificationVote, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  delayed: "Delayed",
  "not-started": "Not Started",
};

const ProjectSkeleton = () => <div className="surface-line h-28 rounded-xl animate-pulse" aria-hidden="true" />;

const ErrorPanel = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="surface-line flex items-center justify-between gap-3 pt-4" role="alert">
    <p className="text-sm text-red-600">{message}</p>
    <Button variant="outline" size="sm" className="rounded-none" onClick={onRetry}>
      Retry
    </Button>
  </div>
);

const AccountHub = ({ targetRole }: { targetRole?: Role }) => {
  const { session, isAuthenticated, isReady, role, signOut } = useAuth();
  const location = useLocation();
  const { data: politicians = [], isLoading: isPoliticiansLoading, isError: isPoliticiansError, refetch: refetchPoliticians } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading, isError: isProjectsError, isFetching: isProjectsFetching, refetch: refetchProjects } = useProjectsQuery();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", category: "Infrastructure", expectedCompletion: "" });
  const [projectUpdateForm, setProjectUpdateForm] = useState({ projectId: "", progress: "", note: "" });
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [issueForm, setIssueForm] = useState({ title: "", description: "", location: "", category: "Infrastructure" });
  const [issueEvidence, setIssueEvidence] = useState<string[]>([]);
  const [activityEvents, setActivityEvents] = useState<ReturnType<typeof listActivityByUser>>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [verificationVote, setVerificationVote] = useState<VerificationVote>("in-progress");
  const [verificationNote, setVerificationNote] = useState("");
  const [verificationEvidence, setVerificationEvidence] = useState<string[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentEvidence, setCommentEvidence] = useState<string[]>([]);

  const [transparencyDocs, setTransparencyDocs] = useState([
    { title: "Asset Declaration 2025", uploaded: "Jan 2026", status: "Verified" },
    { title: "Campaign Expense Report", uploaded: "Jan 2026", status: "Verified" },
  ]);
  const [newDocTitle, setNewDocTitle] = useState("");

  const accountRole: Role = isAuthenticated ? (role === "politician" ? "politician" : "citizen") : targetRole ?? "citizen";
  const demoSession = accountRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;

  useEffect(() => {
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  }, [activeSession.userId, activeSession.ward]);

  const politician = useMemo(() => {
    if (accountRole !== "politician") return null;

    return (
      politicians.find((candidate) => candidate.id === activeSession.userId) ||
      politicians.find((candidate) => candidate.name.trim().toLowerCase() === activeSession.name.trim().toLowerCase()) ||
      null
    );
  }, [accountRole, activeSession.name, activeSession.userId, politicians]);

  const localPoliticians = useMemo(
    () => politicians.filter((candidate) => candidate.ward === activeSession.ward),
    [activeSession.ward, politicians],
  );

  const safeProjects = useMemo(() => (isProjectsError ? [] : projects), [isProjectsError, projects]);
  const allProjects = useMemo(() => [...createdProjects, ...safeProjects], [createdProjects, safeProjects]);

  const localProjects = useMemo(() => {
    if (accountRole === "politician" && politician) {
      return allProjects.filter((project) => project.politicianId === politician.id);
    }

    return allProjects.filter((project) => project.ward === activeSession.ward);
  }, [accountRole, allProjects, activeSession.ward, politician]);

  const visibleProjects = localProjects.length > 0 ? localProjects.slice(0, 8) : allProjects.slice(0, 6);

  useEffect(() => {
    if (!selectedProjectId && visibleProjects.length > 0) {
      setSelectedProjectId(visibleProjects[0].id);
    }

    if (selectedProjectId && !visibleProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(visibleProjects[0]?.id ?? "");
    }
  }, [selectedProjectId, visibleProjects]);

  const selectedProject = useMemo(
    () => visibleProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId, visibleProjects],
  );

  const currentUserVerification = useMemo(() => {
    if (!selectedProjectId) return null;

    return listVerificationsByProject(selectedProjectId).find((item) => item.userId === activeSession.userId) ?? null;
  }, [activeSession.userId, selectedProjectId, activityEvents]);

  const activityItems: ActivityItem[] = useMemo(() => {
    const mapped = activityEvents.map((event) => ({
      type:
        event.type === "verification"
          ? "verification"
          : event.type === "comment"
            ? "comment"
            : event.type === "project"
              ? "update"
              : "evidence",
      author: event.userId === activeSession.userId ? "You" : activeSession.name,
      content: event.summary,
      date: event.createdAt,
    })) satisfies ActivityItem[];

    if (mapped.length > 0) return mapped;

    return [
      {
        type: "update",
        author: "Samsad",
        content: accountRole === "citizen" ? "Report an issue or verify a project to start your civic timeline." : "Create or update a project to start your leadership timeline.",
        date: new Date().toISOString(),
      },
    ];
  }, [accountRole, activeSession.name, activeSession.userId, activityEvents]);

  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const myIssuesCount = issues.filter((issue) => issue.authorId === activeSession.userId).length;
  const pendingIssuesCount = issues.filter((issue) => issue.responses.length === 0).length;

  const publicPerformance = {
    activeProjects: localProjects.length,
    completionRate: localProjects.length > 0 ? Math.round((localProjects.filter((project) => project.status === "completed").length / localProjects.length) * 100) : 0,
    feedbackHandled: issues.filter((issue) => issue.responses.some((entry) => entry.responderId === activeSession.userId)).length,
  };

  if (!isReady) {
    return <div className="min-h-screen bg-neutral-100" aria-busy="true" />;
  }

  const dashboardRoute = accountRole === "politician" ? "/dashboard/politician" : "/dashboard/citizen";
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnAccount = location.pathname === "/account";
  const isMismatchedDashboard = isOnDashboard && location.pathname !== dashboardRoute;

  if (targetRole && targetRole !== accountRole && isAuthenticated) return <Navigate to={dashboardRoute} replace />;
  if ((isOnAccount || isMismatchedDashboard) && isAuthenticated) return <Navigate to={dashboardRoute} replace />;

  const tabs: Tab[] = accountRole === "citizen" ? ["overview", "projects", "activity"] : ["overview", "projects", "activity", "transparency", "settings"];

  const handleOpenNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);

    if (next && unreadNotifications > 0) {
      markAllNotificationsRead(activeSession.userId);
      setNotifications(listNotificationsByUser(activeSession.userId));
    }
  };

  const refreshLocalData = () => {
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  };

  const handleIssueEvidence = (files: FileList | null) => {
    if (!files) {
      setIssueEvidence([]);
      return;
    }

    setIssueEvidence(Array.from(files).map((file) => file.name));
  };

  const handleCreateIssue = () => {
    if (!isAuthenticated || accountRole !== "citizen") return;
    if (!issueForm.title.trim() || !issueForm.description.trim() || !issueForm.location.trim()) return;

    createIssue({
      title: issueForm.title,
      description: issueForm.description,
      location: issueForm.location,
      category: issueForm.category,
      ward: activeSession.ward,
      municipality: activeSession.municipality,
      authorId: activeSession.userId,
      authorName: activeSession.name,
      evidence: issueEvidence,
    });

    pushActivity({
      userId: activeSession.userId,
      userRole: "citizen",
      type: "issue",
      summary: `Reported issue: ${issueForm.title.trim()}`,
    });

    pushNotification({
      userId: activeSession.userId,
      title: "Issue submitted",
      message: "Your issue has been published to your ward inbox.",
    });

    setIssueForm({ title: "", description: "", location: "", category: "Infrastructure" });
    setIssueEvidence([]);
    refreshLocalData();
  };

  const handleRespondIssue = (issueId: string) => {
    const message = responseDrafts[issueId]?.trim();
    if (!message || !isAuthenticated || accountRole !== "politician") return;

    const issue = respondToIssue({
      issueId,
      responderId: activeSession.userId,
      responderName: activeSession.name,
      message,
    });

    if (!issue) return;

    pushActivity({
      userId: activeSession.userId,
      userRole: "politician",
      type: "response",
      summary: `Responded to issue: ${issue.title}`,
    });

    pushNotification({
      userId: activeSession.userId,
      title: "Issue response posted",
      message: `You responded to ${issue.authorName}.`,
    });

    pushNotification({
      userId: issue.authorId,
      title: "Issue response received",
      message: `${activeSession.name} responded to your issue: ${issue.title}`,
    });

    setResponseDrafts((prev) => ({ ...prev, [issueId]: "" }));
    refreshLocalData();
  };

  const handleVerificationEvidence = (files: FileList | null) => {
    if (!files) {
      setVerificationEvidence([]);
      return;
    }

    setVerificationEvidence(Array.from(files).map((file) => file.name));
  };

  const handleCommentEvidence = (files: FileList | null) => {
    if (!files) {
      setCommentEvidence([]);
      return;
    }

    setCommentEvidence(Array.from(files).map((file) => file.name));
  };

  const handleSubmitVerification = () => {
    if (!isAuthenticated || accountRole !== "citizen" || !selectedProjectId) return;

    upsertVerification({
      projectId: selectedProjectId,
      userId: activeSession.userId,
      userName: activeSession.name,
      ward: activeSession.ward,
      vote: verificationVote,
      note: verificationNote,
      evidence: verificationEvidence,
    });

    pushActivity({
      userId: activeSession.userId,
      userRole: "citizen",
      type: "verification",
      summary: `Marked ${selectedProject?.title ?? "project"} as ${voteLabel[verificationVote]}`,
    });

    pushNotification({
      userId: activeSession.userId,
      title: "Verification submitted",
      message: `You marked ${selectedProject?.title ?? "this project"} as ${voteLabel[verificationVote]}.`,
    });

    setVerificationNote("");
    setVerificationEvidence([]);
    refreshLocalData();
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated || accountRole !== "citizen" || !selectedProjectId || !commentDraft.trim()) return;

    addProjectComment({
      projectId: selectedProjectId,
      author: activeSession.name,
      authorId: activeSession.userId,
      ward: activeSession.ward,
      content: commentDraft,
      evidence: commentEvidence,
    });

    pushActivity({
      userId: activeSession.userId,
      userRole: "citizen",
      type: "comment",
      summary: `Commented on ${selectedProject?.title ?? "project"}`,
    });

    pushNotification({
      userId: activeSession.userId,
      title: "Comment posted",
      message: `Your comment is visible on ${selectedProject?.title ?? "the project"}.`,
    });

    setCommentDraft("");
    setCommentEvidence([]);
    refreshLocalData();
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;

    const now = new Date();
    const expected =
      newProject.expectedCompletion && newProject.expectedCompletion.trim().length > 0
        ? newProject.expectedCompletion
        : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180).toISOString();

    const project: Project = {
      id: `local-${now.getTime()}`,
      title: newProject.title.trim(),
      description: `${newProject.title.trim()} — drafted by ${activeSession.name}`,
      location: `${activeSession.ward}, ${activeSession.municipality}`,
      ward: activeSession.ward,
      politicianId: activeSession.userId,
      politicianName: accountRole === "politician" ? politician?.name ?? activeSession.name : activeSession.name,
      startDate: now.toISOString(),
      expectedCompletion: expected,
      status: "in-progress",
      progress: 5,
      category: newProject.category || "General",
      evidenceCount: 0,
      commentCount: 0,
      verificationVotes: { completed: 0, inProgress: 0, delayed: 0, notStarted: 0 },
      milestones: [],
      updates: [{ date: now.toISOString(), content: "Project drafted in dashboard", type: "announcement" }],
    };

    setCreatedProjects((prev) => [project, ...prev]);
    pushActivity({
      userId: activeSession.userId,
      userRole: "politician",
      type: "project",
      summary: `Created project: ${project.title}`,
    });
    pushNotification({
      userId: activeSession.userId,
      title: "Project created",
      message: `${project.title} is now visible in your dashboard.`,
    });

    setShowProjectForm(false);
    setNewProject({ title: "", category: "Infrastructure", expectedCompletion: "" });
    setActiveTab("projects");
    refreshLocalData();
  };

  const handlePostProjectUpdate = () => {
    if (!projectUpdateForm.projectId || !projectUpdateForm.note.trim()) return;

    const progressValue = Math.min(100, Math.max(0, Number(projectUpdateForm.progress || 0)));
    const now = new Date().toISOString();

    setCreatedProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectUpdateForm.projectId) return project;

        return {
          ...project,
          progress: progressValue,
          status: progressValue >= 100 ? "completed" : progressValue > 0 ? "in-progress" : project.status,
          updates: [{ date: now, content: projectUpdateForm.note.trim(), type: progressValue >= 100 ? "completion" : "progress" }, ...project.updates],
        };
      }),
    );

    pushActivity({
      userId: activeSession.userId,
      userRole: "politician",
      type: "project",
      summary: "Published project update",
    });

    setProjectUpdateForm({ projectId: "", progress: "", note: "" });
    refreshLocalData();
  };

  const handleAddTransparencyDoc = () => {
    if (!newDocTitle.trim()) return;

    setTransparencyDocs((prev) => [{ title: newDocTitle.trim(), uploaded: "Just now", status: "Pending" }, ...prev]);
    setNewDocTitle("");
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab("overview");
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="surface-line flex flex-col gap-4 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-border bg-white">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{accountRole === "politician" ? "Politician Dashboard" : "Citizen Dashboard"}</p>
              <h1 className="text-2xl font-bold text-foreground">{accountRole === "politician" ? "Manage work and respond to citizens" : "Participate in your local governance"}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {activeSession.ward}, {activeSession.municipality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-none" onClick={isAuthenticated ? handleSignOut : undefined} asChild={!isAuthenticated}>
              {isAuthenticated ? (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign out
                </span>
              ) : (
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </Button>
            <Button variant="outline" size="sm" className="rounded-none" onClick={handleOpenNotifications}>
              <Bell className="h-4 w-4" />
              Alerts
              {unreadNotifications > 0 && <span className="ml-1 text-xs text-twitter-blue">({unreadNotifications})</span>}
            </Button>
          </div>
        </div>

        {showNotifications && (
          <div className="surface-line mt-4 pt-4">
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            <div className="mt-3 space-y-2">
              {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet.</p>}
              {notifications.map((notification) => (
                <div key={notification.id} className="border-t border-border pt-2">
                  <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-none border-b px-3 py-2 text-sm font-medium ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:border-border"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-5 space-y-5">
            {accountRole === "citizen" ? (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Ward</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{activeSession.ward}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Local Politicians</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{localPoliticians.length}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Ongoing Projects</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{localProjects.length}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">My Issues</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{myIssuesCount}</p>
                  </div>
                </div>

                <div className="surface-line pt-4 space-y-3">
                  <h2 className="text-base font-bold text-foreground">Issue Reporting</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="field-line" placeholder="Issue title" value={issueForm.title} onChange={(event) => setIssueForm((prev) => ({ ...prev, title: event.target.value }))} />
                    <input className="field-line" placeholder="Location" value={issueForm.location} onChange={(event) => setIssueForm((prev) => ({ ...prev, location: event.target.value }))} />
                  </div>
                  <textarea className="field-line min-h-20" placeholder="Describe the issue" value={issueForm.description} onChange={(event) => setIssueForm((prev) => ({ ...prev, description: event.target.value }))} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="field-line" placeholder="Category" value={issueForm.category} onChange={(event) => setIssueForm((prev) => ({ ...prev, category: event.target.value }))} />
                    <label className="field-line flex items-center justify-between text-sm text-muted-foreground">
                      <span>Upload photos/documents</span>
                      <input type="file" multiple className="max-w-[180px] text-xs" onChange={(event) => handleIssueEvidence(event.target.files)} />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{issueEvidence.length > 0 ? `Selected: ${issueEvidence.join(", ")}` : "No files selected"}</p>
                    <Button variant="civic" size="sm" className="rounded-none" onClick={handleCreateIssue} disabled={!isAuthenticated}>
                      Submit Issue
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-base font-bold text-foreground">Ongoing Projects</h2>
                  {isProjectsLoading || isProjectsFetching ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <ProjectSkeleton key={idx} />
                      ))}
                    </div>
                  ) : isProjectsError ? (
                    <ErrorPanel message="Projects failed to load." onRetry={() => refetchProjects()} />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {visibleProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} disableNavigation />
                      ))}
                    </div>
                  )}
                </div>

                <div className="surface-line pt-4">
                  <h2 className="mb-3 text-base font-bold text-foreground">Recent Updates</h2>
                  <ActivityFeed items={activityItems.slice(0, 5)} />
                </div>
              </>
            ) : (
              <>
                <div className="surface-line pt-5">
                  <h2 className="text-base font-bold text-foreground">Performance Overview</h2>
                  {isPoliticiansLoading && <ProjectSkeleton />}
                  {isPoliticiansError && <ErrorPanel message="Could not load profile metrics." onRetry={() => refetchPoliticians()} />}
                  {!isPoliticiansLoading && !isPoliticiansError && politician && (
                    <ScoreDashboard
                      accountability={politician.accountabilityScore}
                      transparency={politician.transparencyScore}
                      communityTrust={politician.communityTrust}
                      engagement={Math.min(politician.engagementPoints, 100)}
                      completedPromises={politician.completedPromises}
                      totalPromises={politician.totalPromises}
                    />
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Total Projects</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.activeProjects}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Completion Rate</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.completionRate}%</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-muted-foreground">Feedback Handled</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.feedbackHandled}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="mt-5 space-y-5">
            {accountRole === "citizen" && (
              <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <h2 className="mb-3 text-base font-bold text-foreground">Projects in Your Ward</h2>
                  {isProjectsLoading || isProjectsFetching ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <ProjectSkeleton key={idx} />
                      ))}
                    </div>
                  ) : isProjectsError ? (
                    <ErrorPanel message="Projects failed to load." onRetry={() => refetchProjects()} />
                  ) : (
                    <>
                      <select className="field-line mb-3" value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
                        {visibleProjects.map((project) => (
                          <option key={project.id} value={project.id}>{project.title}</option>
                        ))}
                      </select>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {visibleProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} disableNavigation />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="surface-line pt-4 space-y-3">
                    <h3 className="font-bold text-foreground">Project Verification</h3>
                    <p className="text-xs text-muted-foreground">Mark selected project status and upload proof.</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["completed", "in-progress", "delayed", "not-started"] as VerificationVote[]).map((vote) => (
                        <button
                          key={vote}
                          type="button"
                          className={`rounded-none border px-2 py-2 text-xs font-semibold ${verificationVote === vote ? "border-primary text-primary" : "border-border text-foreground"}`}
                          onClick={() => setVerificationVote(vote)}
                        >
                          {voteLabel[vote]}
                        </button>
                      ))}
                    </div>
                    <textarea className="field-line min-h-20" placeholder="Add verification note" value={verificationNote} onChange={(event) => setVerificationNote(event.target.value)} />
                    <label className="field-line flex items-center justify-between text-sm text-muted-foreground">
                      <span>Upload proof</span>
                      <input type="file" multiple className="max-w-[160px] text-xs" onChange={(event) => handleVerificationEvidence(event.target.files)} />
                    </label>
                    <Button variant="civic" size="sm" className="w-full rounded-none" onClick={handleSubmitVerification} disabled={!isAuthenticated || !selectedProjectId}>
                      Submit Verification
                    </Button>
                    {currentUserVerification && (
                      <p className="text-xs text-muted-foreground">Latest vote: {voteLabel[currentUserVerification.vote]}</p>
                    )}
                  </div>

                  <div className="surface-line pt-4 space-y-3">
                    <h3 className="font-bold text-foreground">Feedback & Discussion</h3>
                    <textarea className="field-line min-h-20" placeholder="Write a project comment" value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} />
                    <label className="field-line flex items-center justify-between text-sm text-muted-foreground">
                      <span>Attach evidence</span>
                      <input type="file" multiple className="max-w-[160px] text-xs" onChange={(event) => handleCommentEvidence(event.target.files)} />
                    </label>
                    <Button variant="outline" size="sm" className="w-full rounded-none" onClick={handleSubmitComment} disabled={!isAuthenticated || !selectedProjectId || !commentDraft.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {accountRole === "politician" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">Project Creation & Management</h2>
                  <Button variant="civic" size="sm" className="rounded-none" onClick={() => setShowProjectForm((value) => !value)}>
                    <Plus className="mr-1 h-4 w-4" />
                    {showProjectForm ? "Close" : "Add Project"}
                  </Button>
                </div>

                {showProjectForm && (
                  <div className="surface-line pt-4 space-y-3">
                    <input className="field-line" placeholder="Project title" value={newProject.title} onChange={(event) => setNewProject((prev) => ({ ...prev, title: event.target.value }))} />
                    <input className="field-line" placeholder="Category" value={newProject.category} onChange={(event) => setNewProject((prev) => ({ ...prev, category: event.target.value }))} />
                    <input className="field-line" type="date" value={newProject.expectedCompletion} onChange={(event) => setNewProject((prev) => ({ ...prev, expectedCompletion: event.target.value ? new Date(event.target.value).toISOString() : "" }))} />
                    <div className="flex justify-end">
                      <Button variant="civic" size="sm" className="rounded-none" onClick={handleAddProject}>Save project</Button>
                    </div>
                  </div>
                )}

                <div className="surface-line pt-4 space-y-3">
                  <h3 className="font-bold text-foreground">Post Progress Update</h3>
                  <select className="field-line" value={projectUpdateForm.projectId} onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, projectId: event.target.value }))}>
                    <option value="">Select project</option>
                    {createdProjects.map((project) => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                  <input className="field-line" type="number" min={0} max={100} placeholder="Progress %" value={projectUpdateForm.progress} onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, progress: event.target.value }))} />
                  <textarea className="field-line min-h-20" placeholder="Update note" value={projectUpdateForm.note} onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, note: event.target.value }))} />
                  <Button variant="outline" size="sm" className="rounded-none" onClick={handlePostProjectUpdate}>Publish Update</Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} disableNavigation />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="mt-5 space-y-5">
            <div className="surface-line pt-4">
              <h2 className="mb-3 text-base font-bold text-foreground">Activity Tracking</h2>
              <ActivityFeed items={activityItems} />
            </div>

            {accountRole === "citizen" && (
              <div className="surface-line pt-4 space-y-3">
                <h3 className="font-bold text-foreground">My Reported Issues</h3>
                {issues.filter((issue) => issue.authorId === activeSession.userId).map((issue) => (
                  <div key={issue.id} className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                      <span className="text-[11px] uppercase text-muted-foreground">{issue.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                ))}
                {myIssuesCount === 0 && <p className="text-sm text-muted-foreground">No issues reported yet.</p>}
              </div>
            )}

            {accountRole === "politician" && (
              <div className="surface-line pt-4 space-y-3">
                <h3 className="font-bold text-foreground">Issue Response Inbox</h3>
                <p className="text-xs text-muted-foreground">{pendingIssuesCount} pending response</p>
                {issues.map((issue) => (
                  <div key={issue.id} className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{issue.authorName} · {issue.title}</p>
                      <span className="text-[11px] uppercase text-muted-foreground">{issue.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    {issue.responses.length > 0 ? (
                      <p className="mt-2 border-l border-civic-green pl-3 text-sm text-foreground">Response: {issue.responses[0].message}</p>
                    ) : (
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input className="field-line flex-1" placeholder="Write response" value={responseDrafts[issue.id] ?? ""} onChange={(event) => setResponseDrafts((prev) => ({ ...prev, [issue.id]: event.target.value }))} />
                        <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleRespondIssue(issue.id)}>Respond</Button>
                      </div>
                    )}
                  </div>
                ))}
                {issues.length === 0 && <p className="text-sm text-muted-foreground">No ward issues reported yet.</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === "transparency" && accountRole === "politician" && (
          <div className="mt-5 space-y-4">
            <div className="surface-line pt-4 space-y-3">
              <h2 className="text-base font-bold text-foreground">Transparency Docs</h2>
              <div className="flex gap-2">
                <input className="field-line flex-1" placeholder="Document title" value={newDocTitle} onChange={(event) => setNewDocTitle(event.target.value)} />
                <Button variant="civic" size="sm" className="rounded-none" onClick={handleAddTransparencyDoc}>Add</Button>
              </div>
            </div>
            {transparencyDocs.map((doc) => (
              <div key={doc.title} className="surface-line flex items-center justify-between pt-4">
                <p className="text-sm text-foreground">{doc.title}</p>
                <span className="text-xs text-muted-foreground">{doc.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && accountRole === "politician" && (
          <div className="mt-5 max-w-xl surface-line pt-4">
            <h2 className="text-base font-bold text-foreground">Profile Settings</h2>
            <div className="mt-3 space-y-3">
              <input className="field-line" placeholder={activeSession.name} />
              <input className="field-line" placeholder={activeSession.ward} />
              <Button variant="civic" size="sm" className="rounded-none">Save Changes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountHub;
