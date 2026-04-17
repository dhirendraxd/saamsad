"use client";

import { type ElementType, useEffect, useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import type { ActivityItem } from "@/components/ActivityFeed";
import {
  Activity,
  BarChart2,
  Bell,
  BookOpen,
  Compass,
  Eye,
  FolderOpen,
  Home,
  Layers,
  LogIn,
  MapPin,
  Megaphone,
  Plus,
  Search,
  Settings,
  Settings2,
  Shield,
  Upload,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { Link, Navigate, useLocation } from "@/lib/router";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";
import type { Project } from "@/lib/api/contracts";
import {
  createIssue,
  listNotificationsByUser,
  listActivityByUser,
  listIssuesByWard,
  markAllNotificationsRead,
  pushNotification,
  pushActivity,
  respondToIssue,
  type IssueReport,
  type NotificationItem,
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

const tabs: { key: Tab; label: string; icon: ElementType }[] = [
  { key: "overview", label: "Overview", icon: Eye },
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "transparency", label: "Transparency", icon: Shield },
  { key: "settings", label: "Settings", icon: Settings },
];

const mockPoliticianActivity: ActivityItem[] = [
  { type: "update", author: "You", content: "Posted a 40% progress update for Ward 5 Community Clinic", date: "2026-03-13" },
  { type: "comment", author: "Citizens", content: "14 new comments received on Water Pipeline Expansion", date: "2026-03-12" },
  { type: "evidence", author: "You", content: "Uploaded campaign expense report and procurement note", date: "2026-03-10" },
  { type: "update", author: "You", content: "Published manifesto promise: Improve school sanitation facilities", date: "2026-03-08" },
  { type: "comment", author: "You", content: "Responded to 5 ward feedback threads", date: "2026-03-06" },
];

const fallbackCitizenActivity: ActivityItem[] = [
  {
    type: "update",
    author: "Samsad",
    content: "Start by reporting an issue or verifying a project to build your local activity timeline.",
    date: new Date().toISOString(),
  },
];

const ProjectSkeleton = () => <div className="surface-line h-28 rounded-xl animate-pulse" aria-hidden="true" />;
const StatSkeleton = () => <div className="surface-line h-40 rounded-xl animate-pulse" aria-hidden="true" />;
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
  const [newPromise, setNewPromise] = useState("");
  const [manifestoPromises, setManifestoPromises] = useState<string[]>([
    "Upgrade ward drinking water lines in high-density blocks.",
    "Open one new primary health outreach center by year end.",
    "Publish municipal procurement updates every quarter.",
  ]);
  const [projectUpdateForm, setProjectUpdateForm] = useState({ projectId: "", progress: "", note: "" });
  const [transparencyDocs, setTransparencyDocs] = useState([
    { title: "Asset Declaration 2025", uploaded: "Jan 2026", status: "Verified" },
    { title: "Campaign Expense Report", uploaded: "Jan 2026", status: "Verified" },
    { title: "Policy Note: Clean Water", uploaded: "Jan 2026", status: "Verified" },
  ]);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [activityEvents, setActivityEvents] = useState<ReturnType<typeof listActivityByUser>>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "Infrastructure",
  });
  const [issueEvidence, setIssueEvidence] = useState<string[]>([]);
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});

  const accountRole: Role = isAuthenticated ? (role === "politician" ? "politician" : "citizen") : targetRole ?? "citizen";
  const demoSession = accountRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;

  useEffect(() => {
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  }, [activeSession.userId, activeSession.ward]);

  const politician = useMemo(() => {
    if (!activeSession || accountRole !== "politician") return null;
    return (
      politicians.find((candidate) => candidate.id === activeSession.userId) ||
      politicians.find((candidate) => candidate.name.trim().toLowerCase() === activeSession.name.trim().toLowerCase()) ||
      null
    );
  }, [accountRole, politicians, activeSession]);

  const safeProjects = useMemo(() => (isProjectsError ? [] : projects), [isProjectsError, projects]);
  const localPoliticians = useMemo(
    () => politicians.filter((candidate) => candidate.ward === activeSession.ward),
    [activeSession.ward, politicians],
  );
  const allProjects = useMemo(() => [...createdProjects, ...safeProjects], [createdProjects, safeProjects]);
  const localProjects = useMemo(() => {
    if (!activeSession) return [];
    if (accountRole === "politician" && politician) return allProjects.filter((project) => project.politicianId === politician.id);
    return allProjects.filter((project) => project.ward === activeSession.ward);
  }, [accountRole, politician, allProjects, activeSession]);
  const visibleProjects = localProjects.length > 0 ? localProjects.slice(0, 6) : allProjects.slice(0, 4);
  const dynamicActivityItems: ActivityItem[] = activityEvents.map((event) => ({
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
  }));
  const activityItems =
    dynamicActivityItems.length > 0
      ? dynamicActivityItems
      : accountRole === "politician"
        ? mockPoliticianActivity
        : fallbackCitizenActivity;
  const answeredFeedback = issues.filter((issue) => issue.responses.some((entry) => entry.responderId === activeSession.userId)).length;
  const pendingFeedback = issues.filter((issue) => issue.responses.length === 0).length;
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;

  const publicPerformance = {
    publishedPromises: manifestoPromises.length,
    activeProjects: localProjects.length,
    transparencyDocs: transparencyDocs.length,
    respondedFeedback: answeredFeedback,
  };

  if (!isReady) return <div className="min-h-screen bg-neutral-100" aria-busy="true" />;

  const dashboardRoute = accountRole === "politician" ? "/dashboard/politician" : "/dashboard/citizen";
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnAccount = location.pathname === "/account";
  const isMismatchedDashboard = isOnDashboard && location.pathname !== dashboardRoute;
  if (targetRole && targetRole !== accountRole && isAuthenticated) return <Navigate to={dashboardRoute} replace />;
  if ((isOnAccount || isMismatchedDashboard) && isAuthenticated) return <Navigate to={dashboardRoute} replace />;

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    const now = new Date();
    const expected = newProject.expectedCompletion && newProject.expectedCompletion.trim().length > 0
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
      updates: [{ date: now.toISOString(), content: "Project drafted in dashboard (local only)", type: "announcement" }],
    };

    setCreatedProjects((prev) => [project, ...prev]);
    if (isAuthenticated) {
      pushActivity({
        userId: activeSession.userId,
        userRole: accountRole,
        type: "project",
        summary: `Created project: ${project.title}`,
      });
      pushNotification({
        userId: activeSession.userId,
        title: "Project created",
        message: `${project.title} is now visible in your workspace.`,
      });
      setActivityEvents(listActivityByUser(activeSession.userId));
      setNotifications(listNotificationsByUser(activeSession.userId));
    }
    setShowProjectForm(false);
    setNewProject({ title: "", category: "Infrastructure", expectedCompletion: "" });
    setActiveTab("projects");
  };

  const handleAddTransparencyDoc = () => {
    if (!newDocTitle.trim()) return;
    setTransparencyDocs((prev) => [{ title: newDocTitle.trim(), uploaded: "Just now", status: "Pending" }, ...prev]);
    setNewDocTitle("");
  };

  const handleAddManifestoPromise = () => {
    if (!newPromise.trim()) return;
    setManifestoPromises((prev) => [newPromise.trim(), ...prev]);
    setNewPromise("");
  };

  const handlePostProjectUpdate = () => {
    if (!projectUpdateForm.projectId || !projectUpdateForm.note.trim()) return;

    const progressValue = Math.min(100, Math.max(0, Number(projectUpdateForm.progress || 0)));
    const now = new Date().toISOString();

    setCreatedProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectUpdateForm.projectId) {
          return project;
        }

        return {
          ...project,
          progress: progressValue,
          status: progressValue >= 100 ? "completed" : progressValue > 0 ? "in-progress" : project.status,
          updates: [
            {
              date: now,
              content: projectUpdateForm.note.trim(),
              type: progressValue >= 100 ? "completion" : "progress",
            },
            ...project.updates,
          ],
        };
      }),
    );

    setProjectUpdateForm({ projectId: "", progress: "", note: "" });
    if (isAuthenticated) {
      pushActivity({
        userId: activeSession.userId,
        userRole: accountRole,
        type: "project",
        summary: `Published project progress update`,
      });
      pushNotification({
        userId: activeSession.userId,
        title: "Progress update published",
        message: "Citizens can now see your latest project update.",
      });
      setActivityEvents(listActivityByUser(activeSession.userId));
      setNotifications(listNotificationsByUser(activeSession.userId));
    }
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
      message: "Your issue has been published to the ward issue inbox.",
    });

    setIssueForm({ title: "", description: "", location: "", category: "Infrastructure" });
    setIssueEvidence([]);
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

  const handleRespondIssue = (issueId: string) => {
    const message = responseDrafts[issueId]?.trim();
    if (!message || !isAuthenticated || accountRole !== "politician") return;

    const issue = respondToIssue({
      issueId,
      responderId: activeSession.userId,
      responderName: activeSession.name,
      message,
    });

    if (!issue) {
      return;
    }

    pushActivity({
      userId: activeSession.userId,
      userRole: "politician",
      type: "response",
      summary: `Responded to issue: ${issue.title}`,
    });
    pushNotification({
      userId: activeSession.userId,
      title: "Issue response posted",
      message: `You responded to ${issue.authorName}'s issue.`,
    });
    pushNotification({
      userId: issue.authorId,
      title: "Your issue received a response",
      message: `${activeSession.name} responded to: ${issue.title}`,
    });

    setResponseDrafts((prev) => ({ ...prev, [issueId]: "" }));
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  };

  const handleOpenNotifications = () => {
    const nextVisible = !showNotifications;
    setShowNotifications(nextVisible);
    if (nextVisible && unreadNotifications > 0) {
      markAllNotificationsRead(activeSession.userId);
      setNotifications(listNotificationsByUser(activeSession.userId));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab("overview");
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="flex gap-6 px-4 py-6 lg:px-10">
        <aside className="hidden lg:flex w-64 min-h-[calc(100vh-48px)] flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sticky top-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10" />
            <div>
              <p className="text-sm font-semibold text-foreground">Samsad</p>
              <p className="text-xs text-muted-foreground">Politician workspace</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {accountRole === "politician" ? (
              <>
                <Button
                  variant="civic"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => { setActiveTab("projects"); setShowProjectForm(true); }}
                >
                  <Layers className="h-4 w-4" />
                  Update projects
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => setActiveTab("transparency")}
                >
                  <Shield className="h-4 w-4" />
                  Publish transparency
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="civic"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => setActiveTab("projects")}
                >
                  <Layers className="h-4 w-4" />
                  Follow projects
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => setActiveTab("activity")}
                >
                  <Upload className="h-4 w-4" />
                  Upload evidence
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 rounded-none"
              onClick={() => setActiveTab("activity")}
            >
              <Activity className="h-4 w-4" />
              View recent activity
            </Button>
          </div>
          <div className="mt-auto space-y-2 text-sm">
            {accountRole === "politician" && (
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-none" onClick={() => setActiveTab("settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 rounded-none"
              onClick={isAuthenticated ? handleSignOut : undefined}
              asChild={!isAuthenticated}
            >
              {isAuthenticated ? (
                <span className="flex items-center gap-2"><LogIn className="h-4 w-4" />Sign out</span>
              ) : (
                <Link to="/auth" className="flex items-center gap-2"><LogIn className="h-4 w-4" />Sign in</Link>
              )}
            </Button>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{accountRole === "politician" ? "Politician Dashboard" : "Citizen Dashboard"}</p>
                <h1 className="text-xl font-semibold text-foreground">
                  {accountRole === "politician" ? "Track promises and publish transparency updates" : "Follow projects and keep leaders accountable"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{accountRole === "politician" ? politician?.constituency ?? activeSession.ward : `${activeSession.ward}, ${activeSession.municipality}`}</span>
                </div>
              </div>
            </div>
            {accountRole === "politician" && (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 rounded-full border border-border px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input className="outline-none text-sm bg-transparent" placeholder="Search projects or updates" aria-label="Search projects or updates" />
                </div>
                <Button variant="outline" size="sm" className="rounded-none relative" onClick={handleOpenNotifications}>
                  <Bell className="w-4 h-4 mr-1" />
                  Alerts
                  {unreadNotifications > 0 && (
                    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-none border border-twitter-blue px-1 text-[10px] font-semibold text-twitter-blue">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>

          {accountRole === "politician" && showNotifications && (
            <div className="surface-line pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground">{notifications.length} total</p>
              </div>
              <div className="space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border-t border-border pt-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                        {!notification.isRead && <span className="h-2 w-2 rounded-full bg-twitter-blue" aria-hidden="true" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No notifications yet.</p>
                )}
              </div>
            </div>
          )}

          <div className="h-4" aria-hidden="true" />

          <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-2">
            {tabs
              .filter((tab) => (accountRole === "citizen" ? ["overview", "projects", "activity"].includes(tab.key) : true))
                .map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-none border-b px-3 py-1.5 text-sm font-medium ${
                      activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:border-border"
                    }`}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {accountRole === "politician" && (
                    <>
                      <div className="surface-line pt-6">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-lg font-bold text-foreground">Public Performance Summary</h2>
                          <span className="text-xs uppercase tracking-[0.16em] text-civic-green">Publicly visible</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="border-t border-border pt-2">
                            <p className="text-2xl font-extrabold text-foreground">{publicPerformance.publishedPromises}</p>
                            <p className="text-xs text-muted-foreground">Promises Published</p>
                          </div>
                          <div className="border-t border-border pt-2">
                            <p className="text-2xl font-extrabold text-foreground">{publicPerformance.activeProjects}</p>
                            <p className="text-xs text-muted-foreground">Managed Projects</p>
                          </div>
                          <div className="border-t border-border pt-2">
                            <p className="text-2xl font-extrabold text-foreground">{publicPerformance.transparencyDocs}</p>
                            <p className="text-xs text-muted-foreground">Transparency Docs</p>
                          </div>
                          <div className="border-t border-border pt-2">
                            <p className="text-2xl font-extrabold text-foreground">{publicPerformance.respondedFeedback}</p>
                            <p className="text-xs text-muted-foreground">Feedback Answered</p>
                          </div>
                        </div>
                      </div>
                      {isPoliticiansLoading && <StatSkeleton />}
                      {isPoliticiansError && <ErrorPanel message="Couldn't load your transparency stats. Please retry." onRetry={() => refetchPoliticians()} />}
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
                      {!isPoliticiansLoading && !isPoliticiansError && !politician && (
                        <div className="surface-line pt-6 text-sm text-muted-foreground">We couldn’t match your profile to a politician record yet.</div>
                      )}
                    </>
                  )}
                  {accountRole === "citizen" && (
                    <div className="surface-line pt-6 space-y-3">
                      <h2 className="text-lg font-bold text-foreground mb-2">Local Area Dashboard</h2>
                      <p className="text-sm text-muted-foreground">
                        You are verified for {activeSession.ward}, {activeSession.municipality}. Track local projects, raise issues, and verify progress.
                      </p>
                      <div className="border-t border-border pt-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Local Politicians</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {localPoliticians.length > 0 ? (
                            localPoliticians.map((candidate) => (
                              <span key={candidate.id} className="border-b border-border pb-0.5 text-sm text-foreground">
                                {candidate.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No local politicians matched your ward yet.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-foreground">{accountRole === "citizen" ? "Local Projects" : "Your Projects"}</h2>
                      {accountRole === "politician" && (
                        <Button
                          variant="civic"
                          size="sm"
                          className="rounded-none"
                          onClick={() => {
                            setActiveTab("projects");
                            setShowProjectForm(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Project
                        </Button>
                      )}
                    </div>
                    {isProjectsLoading || isProjectsFetching ? (
                      <div className="grid sm:grid-cols-2 gap-4" aria-live="polite">
                        {Array.from({ length: 4 }).map((_, idx) => <ProjectSkeleton key={idx} />)}
                      </div>
                    ) : isProjectsError ? (
                      <ErrorPanel message="Projects failed to load. Check your connection and retry." onRetry={() => refetchProjects()} />
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                      </div>
                    )}
                  </div>

                  {accountRole === "citizen" && (
                    <>
                      <div className="surface-line pt-4 space-y-3">
                        <h3 className="text-base font-bold text-foreground">Issue Reporting</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            className="field-line"
                            placeholder="Issue title (broken road, missing service...)"
                            value={issueForm.title}
                            onChange={(event) => setIssueForm((prev) => ({ ...prev, title: event.target.value }))}
                          />
                          <input
                            className="field-line"
                            placeholder="Location"
                            value={issueForm.location}
                            onChange={(event) => setIssueForm((prev) => ({ ...prev, location: event.target.value }))}
                          />
                        </div>
                        <textarea
                          className="field-line min-h-20"
                          placeholder="Describe the issue in detail"
                          value={issueForm.description}
                          onChange={(event) => setIssueForm((prev) => ({ ...prev, description: event.target.value }))}
                        />
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            className="field-line"
                            placeholder="Category"
                            value={issueForm.category}
                            onChange={(event) => setIssueForm((prev) => ({ ...prev, category: event.target.value }))}
                          />
                          <label className="field-line flex items-center justify-between text-sm text-muted-foreground">
                            <span>Upload photos/documents</span>
                            <input type="file" multiple onChange={(event) => handleIssueEvidence(event.target.files)} className="max-w-[180px] text-xs" />
                          </label>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-muted-foreground">{issueEvidence.length > 0 ? `Selected: ${issueEvidence.join(", ")}` : "No files selected"}</p>
                          <Button variant="civic" size="sm" className="rounded-none" onClick={handleCreateIssue} disabled={!isAuthenticated}>
                            Submit Issue
                          </Button>
                        </div>
                      </div>

                      <div className="surface-line pt-4">
                        <h3 className="text-base font-bold text-foreground mb-3">Recent Updates & Activity</h3>
                        <ActivityFeed items={activityItems.slice(0, 5)} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-4">
                  {accountRole === "citizen" && (
                    <div className="surface-line pt-4 space-y-3">
                      <h3 className="text-base font-bold text-foreground">Report Local Issue</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="field-line"
                          placeholder="Issue title (e.g., Broken drainage)"
                          value={issueForm.title}
                          onChange={(event) => setIssueForm((prev) => ({ ...prev, title: event.target.value }))}
                        />
                        <input
                          className="field-line"
                          placeholder="Location"
                          value={issueForm.location}
                          onChange={(event) => setIssueForm((prev) => ({ ...prev, location: event.target.value }))}
                        />
                      </div>
                      <textarea
                        className="field-line min-h-20"
                        placeholder="Describe the issue"
                        value={issueForm.description}
                        onChange={(event) => setIssueForm((prev) => ({ ...prev, description: event.target.value }))}
                      />
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="field-line"
                          placeholder="Category (Infrastructure, Utilities...)"
                          value={issueForm.category}
                          onChange={(event) => setIssueForm((prev) => ({ ...prev, category: event.target.value }))}
                        />
                        <label className="field-line flex items-center justify-between text-sm text-muted-foreground">
                          <span>Attach photos/documents</span>
                          <input type="file" multiple onChange={(event) => handleIssueEvidence(event.target.files)} className="max-w-[180px] text-xs" />
                        </label>
                      </div>
                      {issueEvidence.length > 0 && (
                        <p className="text-xs text-muted-foreground">Selected: {issueEvidence.join(", ")}</p>
                      )}
                      <div className="flex justify-end">
                        <Button variant="civic" size="sm" className="rounded-none" onClick={handleCreateIssue} disabled={!isAuthenticated}>
                          Submit Issue
                        </Button>
                      </div>
                    </div>
                  )}

                  {accountRole === "politician" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Create and manage development projects for your constituency.</p>
                        <Button variant="civic" size="sm" onClick={() => setShowProjectForm((v) => !v)} className="rounded-none">
                          <Plus className="w-4 h-4 mr-1" />
                          {showProjectForm ? "Close form" : "Add Project"}
                        </Button>
                      </div>

                      <div className="surface-line pt-4 space-y-3">
                        <p className="text-sm font-medium text-foreground">Post progress update</p>
                        <div className="grid gap-3 md:grid-cols-3">
                          <select
                            className="field-line"
                            value={projectUpdateForm.projectId}
                            onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, projectId: event.target.value }))}
                          >
                            <option value="">Select project</option>
                            {createdProjects.map((project) => (
                              <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                          </select>
                          <input
                            className="field-line"
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Progress %"
                            value={projectUpdateForm.progress}
                            onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, progress: event.target.value }))}
                          />
                          <Button variant="outline" size="sm" className="rounded-none" onClick={handlePostProjectUpdate}>
                            Publish update
                          </Button>
                        </div>
                        <textarea
                          className="field-line min-h-20"
                          placeholder="Write update details for citizens..."
                          value={projectUpdateForm.note}
                          onChange={(event) => setProjectUpdateForm((prev) => ({ ...prev, note: event.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                  {showProjectForm && accountRole === "politician" && (
                    <div className="surface-line space-y-3 pt-4">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="sm:w-1/3 text-sm font-medium text-foreground">Title</label>
                        <input
                          className="field-line flex-1"
                          placeholder="e.g., Ward 5 Community Clinic"
                          value={newProject.title}
                          onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="sm:w-1/3 text-sm font-medium text-foreground">Category</label>
                        <input
                          className="field-line flex-1"
                          placeholder="Infrastructure, Health, Education..."
                          value={newProject.category}
                          onChange={(e) => setNewProject((p) => ({ ...p, category: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="sm:w-1/3 text-sm font-medium text-foreground">Expected completion</label>
                        <input
                          className="field-line flex-1"
                          type="date"
                          value={newProject.expectedCompletion}
                          onChange={(e) => setNewProject((p) => ({ ...p, expectedCompletion: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="civic" size="sm" className="rounded-none" onClick={handleAddProject}>
                          Save project (local)
                        </Button>
                      </div>
                    </div>
                  )}
                  {isProjectsLoading || isProjectsFetching ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, idx) => <ProjectSkeleton key={idx} />)}
                    </div>
                  ) : isProjectsError ? (
                    <ErrorPanel message="Projects failed to load. Check your connection and retry." onRetry={() => refetchProjects()} />
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-4">
                  <ActivityFeed items={activityItems} />

                  {accountRole === "citizen" && (
                    <div className="surface-line pt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">My Reported Issues</h3>
                        <p className="text-xs text-muted-foreground">{issues.filter((issue) => issue.authorId === activeSession.userId).length} total</p>
                      </div>
                      {issues
                        .filter((issue) => issue.authorId === activeSession.userId)
                        .map((issue) => (
                          <div key={issue.id} className="border-t border-border pt-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{issue.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{issue.location} · {new Date(issue.createdAt).toLocaleDateString()}</p>
                            {issue.responses.length > 0 && (
                              <div className="mt-2 border-l border-civic-green pl-3">
                                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Latest response</p>
                                <p className="text-sm text-foreground">{issue.responses[0].message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      {issues.filter((issue) => issue.authorId === activeSession.userId).length === 0 && (
                        <p className="text-sm text-muted-foreground">No reported issues yet. Use the Projects tab to file your first issue.</p>
                      )}
                    </div>
                  )}

                  {accountRole === "politician" && (
                    <div className="surface-line pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">Ward Issue Inbox</h3>
                        <p className="text-xs text-muted-foreground">{pendingFeedback} pending response</p>
                      </div>
                      {issues.map((item) => (
                        <div key={item.id} className="border-t border-border pt-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">{item.authorName} · {item.title}</p>
                            <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{item.status}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{item.location} · {new Date(item.createdAt).toLocaleDateString()}</p>

                          {item.responses.length > 0 ? (
                            <p className="mt-2 border-l border-civic-green pl-3 text-sm text-foreground">Response: {item.responses[0].message}</p>
                          ) : (
                            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                              <input
                                className="field-line flex-1"
                                placeholder="Write your response"
                                value={responseDrafts[item.id] ?? ""}
                                onChange={(event) =>
                                  setResponseDrafts((prev) => ({
                                    ...prev,
                                    [item.id]: event.target.value,
                                  }))
                                }
                              />
                              <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleRespondIssue(item.id)}>
                                Respond
                              </Button>
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
                <div className="space-y-4">
                  <div className="surface-line pt-4 space-y-3">
                    <p className="text-sm font-medium text-foreground">Publish manifesto promise</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        className="field-line flex-1"
                        placeholder="e.g., Complete all school sanitation retrofits by Q4"
                        value={newPromise}
                        onChange={(e) => setNewPromise(e.target.value)}
                      />
                      <Button variant="civic" size="sm" className="rounded-none" onClick={handleAddManifestoPromise}>
                        <Megaphone className="w-4 h-4 mr-1" />
                        Publish Promise
                      </Button>
                    </div>
                    <div className="space-y-2 border-t border-border pt-3">
                      {manifestoPromises.map((promise, index) => (
                        <p key={`${promise}-${index}`} className="text-sm text-foreground">• {promise}</p>
                      ))}
                    </div>
                  </div>

                  <div className="surface-line pt-4 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        className="field-line flex-1"
                        placeholder="e.g., FY 2026 Expense Report"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                      />
                      <Button variant="civic" size="sm" className="rounded-none" onClick={handleAddTransparencyDoc}>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload (local)
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Adds to your transparency list for demo purposes.</p>
                  </div>
                  {transparencyDocs.map((doc) => (
                    <div key={doc.title} className="surface-line flex items-center justify-between pt-4">
                      <div>
                        <p className="font-medium text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">Uploaded {doc.uploaded}</p>
                      </div>
                      <span className="border-b border-civic-green/40 pb-0.5 text-xs font-medium text-civic-green">{doc.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="surface-line max-w-lg pt-6">
                  <h3 className="font-bold text-foreground mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    {["Display Name", "Email", "Phone", "Ward"].map((field) => (
                      <div key={field}>
                        <label className="text-sm font-medium text-foreground block mb-1">{field}</label>
                        <input
                          className="field-line"
                          placeholder={
                            field === "Display Name"
                              ? activeSession.name
                              : field === "Ward"
                                ? activeSession.ward
                                : field
                          }
                        />
                      </div>
                    ))}
                    <Button variant="civic" className="mt-2 rounded-none">Save Changes</Button>
                  </div>
                </div>
              )}
            </div>

            {accountRole === "politician" && (
              <div className="space-y-4 rounded-2xl bg-white/60 p-4 shadow-sm">
              <div className="rounded-lg border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Direct Messages</p>
                  <Button variant="outline" size="sm" className="rounded-none">View</Button>
                </div>
                <div className="flex -space-x-2">
                  {["Mila", "Lise", "Favour", "Vimal", "Mary"].map((name) => (
                    <div key={name} className="h-9 w-9 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-xs font-semibold text-primary">
                      {name[0]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Activities</p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {activityItems.slice(0, 6).map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          item.type === "verification"
                            ? "bg-green-500"
                            : item.type === "comment"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                        }`}
                      />
                      <div>
                        <p className="text-foreground">
                          {item.author} {item.type === "verification" ? "verified" : item.type === "evidence" ? "uploaded evidence" : "commented"}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHub;
