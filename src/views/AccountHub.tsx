"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  LogIn,
  MapPin,
  Plus,
  User,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  X,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import PoliticianPanel from "@/components/PoliticianPanel";
import type { ActivityItem } from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { Link, Navigate, useLocation, useNavigate } from "@/lib/router";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";
import type { Politician, Project } from "@/lib/api/contracts";
import {
  addPoliticianPublicImage,
  addProjectComment,
  createIssue,
  listActivityByUser,
  listIssuesByWard,
  listNotificationsByUser,
  listPoliticianPublicImages,
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
  ward: "Kathmandu Constituency 5",
  municipality: "Kathmandu",
  verified: false,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
};

const DEMO_POLITICIAN = {
  userId: "demo-politician",
  role: "politician" as const,
  name: "Demo Politician",
  ward: "Kathmandu Constituency 5",
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

const formatConstituencyLabel = (value: string) => value.replace(/^Ward\b/i, "Constituency");
const firstSentence = (value: string) => {
  const sentence = value
    .split(".")
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  return sentence ? `${sentence}.` : "Representative record available.";
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

const EmptyProjectSlot = () => (
  <div className="surface-line border-dashed border-accent/30 pt-5">
    <p className="text-sm font-semibold text-foreground">Project Slot Open</p>
    <p className="mt-1 text-xs text-muted-foreground">No additional ongoing projects found in this constituency yet.</p>
  </div>
);

const AccountHub = ({ targetRole }: { targetRole?: Role }) => {
  const { session, isAuthenticated, isReady, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: politicians = [], isLoading: isPoliticiansLoading, isError: isPoliticiansError, refetch: refetchPoliticians } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading, isError: isProjectsError, isFetching: isProjectsFetching, refetch: refetchProjects } = useProjectsQuery();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", category: "Infrastructure", expectedCompletion: "" });
  const [projectUpdateForm, setProjectUpdateForm] = useState({ projectId: "", progress: "", note: "" });

  // Enhanced project filter & search state
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<"all" | "completed" | "in-progress" | "delayed" | "not-started">("all");
  const [projectSortBy, setProjectSortBy] = useState<"title" | "progress" | "date">("title");
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [showVerificationConfirm, setShowVerificationConfirm] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

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
  const [publicImageCaption, setPublicImageCaption] = useState("");
  const [politicianPublicImages, setPoliticianPublicImages] = useState<ReturnType<typeof listPoliticianPublicImages>>([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState<Politician | null>(null);

  const accountRole: Role = isAuthenticated ? (role === "politician" ? "politician" : "citizen") : targetRole ?? "citizen";
  const demoSession = accountRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;
  const activeConstituency = formatConstituencyLabel(activeSession.ward);

  useEffect(() => {
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  }, [activeSession.userId, activeSession.ward]);

  useEffect(() => {
    if (accountRole !== "politician") {
      setPoliticianPublicImages([]);
      return;
    }

    const politicianId = activeSession.userId;
    setPoliticianPublicImages(listPoliticianPublicImages(politicianId));
  }, [accountRole, activeSession.userId]);

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

  const wardChairperson = useMemo(() => {
    if (localPoliticians.length === 0) return null;

    return [...localPoliticians].sort((left, right) => {
      if (right.accountabilityScore !== left.accountabilityScore) {
        return right.accountabilityScore - left.accountabilityScore;
      }

      if (right.activeProjects !== left.activeProjects) {
        return right.activeProjects - left.activeProjects;
      }

      return right.communityTrust - left.communityTrust;
    })[0];
  }, [localPoliticians]);

  const wardCouncilMembers = useMemo(() => {
    if (!wardChairperson) return [];
    return localPoliticians.filter((candidate) => candidate.id !== wardChairperson.id).slice(0, 4);
  }, [localPoliticians, wardChairperson]);

  const safeProjects = useMemo(() => (isProjectsError ? [] : projects), [isProjectsError, projects]);
  const allProjects = useMemo(() => [...createdProjects, ...safeProjects], [createdProjects, safeProjects]);

  const localProjects = useMemo(() => {
    if (accountRole === "politician" && politician) {
      return allProjects.filter((project) => project.politicianId === politician.id);
    }

    return allProjects.filter((project) => project.ward === activeSession.ward);
  }, [accountRole, allProjects, activeSession.ward, politician]);

  const ongoingLocalProjects = useMemo(
    () => localProjects.filter((project) => project.status !== "completed"),
    [localProjects],
  );

  const overviewProjectCards = useMemo(
    () => ongoingLocalProjects.slice(0, 3),
    [ongoingLocalProjects],
  );

  const visibleProjects = useMemo(
    () => (localProjects.length > 0 ? localProjects.slice(0, 8) : allProjects.slice(0, 6)),
    [allProjects, localProjects],
  );

  // Enhanced filtering and sorting
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = visibleProjects;

    // Apply status filter
    if (projectStatusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === projectStatusFilter);
    }

    // Apply search
    if (projectSearchQuery.trim()) {
      const q = projectSearchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (projectSortBy) {
      case "progress":
        sorted.sort((a, b) => b.progress - a.progress);
        break;
      case "date":
        sorted.sort((a, b) => new Date(b.expectedCompletion).getTime() - new Date(a.expectedCompletion).getTime());
        break;
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [visibleProjects, projectStatusFilter, projectSearchQuery, projectSortBy]);

  // Helper: Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <TrendingUp className="h-4 w-4" />;
      case "delayed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Helper: Get status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "delayed":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  useEffect(() => {
    if (!selectedProjectId && filteredAndSortedProjects.length > 0) {
      setSelectedProjectId(filteredAndSortedProjects[0].id);
      return;
    }

    if (selectedProjectId && !filteredAndSortedProjects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(filteredAndSortedProjects[0]?.id ?? "");
    }
  }, [selectedProjectId, filteredAndSortedProjects]);

  const selectedProject = useMemo(
    () => filteredAndSortedProjects.find((p) => p.id === selectedProjectId) ?? null,
    [selectedProjectId, filteredAndSortedProjects],
  );

  const currentUserVerification = useMemo(() => {
    if (!selectedProjectId) return null;
    return listVerificationsByProject(selectedProjectId).find((item) => item.userId === activeSession.userId) ?? null;
  }, [activeSession.userId, selectedProjectId]);

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

  const refreshLocalData = () => {
    setIssues(listIssuesByWard(activeSession.ward));
    setActivityEvents(listActivityByUser(activeSession.userId));
    setNotifications(listNotificationsByUser(activeSession.userId));
  };

  const handleOpenNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);

    if (next && unreadNotifications > 0) {
      markAllNotificationsRead(activeSession.userId);
      setNotifications(listNotificationsByUser(activeSession.userId));
    }
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
      message: "Your issue has been published to your constituency inbox.",
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
    // Show confirmation first
    setShowVerificationConfirm(true);
  };

  const confirmSubmitVerification = async () => {
    if (!selectedProjectId) return;
    setVerificationSubmitting(true);
    setShowVerificationConfirm(false);

    try {
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
        title: "✓ Verification submitted",
        message: `You marked "${selectedProject?.title ?? "this project"}" as ${voteLabel[verificationVote]}.`,
      });

      setVerificationNote("");
      setVerificationEvidence([]);
      refreshLocalData();
    } finally {
      setVerificationSubmitting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated || accountRole !== "citizen" || !selectedProjectId || !commentDraft.trim()) return;
    setCommentSubmitting(true);

    try {
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
        title: "✓ Comment posted",
        message: `Your comment is visible on "${selectedProject?.title ?? "the project"}".`,
      });

      setCommentDraft("");
      setCommentEvidence([]);
      refreshLocalData();
    } finally {
      setCommentSubmitting(false);
    }
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

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(file);
    });

  const handlePublicInteractionUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !isAuthenticated || accountRole !== "politician") return;

    const politicianId = politician?.id ?? activeSession.userId;
    const selected = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (selected.length === 0) return;

    const imageDataUrls = await Promise.all(selected.map((file) => fileToDataUrl(file)));
    imageDataUrls.forEach((imageDataUrl) => {
      if (!imageDataUrl) return;
      addPoliticianPublicImage({
        politicianId,
        authorId: activeSession.userId,
        authorName: activeSession.name,
        imageDataUrl,
        caption: publicImageCaption,
      });
    });

    pushActivity({
      userId: activeSession.userId,
      userRole: "politician",
      type: "project",
      summary: `Uploaded ${imageDataUrls.length} public interaction photo${imageDataUrls.length > 1 ? "s" : ""}`,
    });

    setPoliticianPublicImages(listPoliticianPublicImages(politicianId));
    setPublicImageCaption("");
  };

  const handleDashboardProjectClick = (project: Project) => {
    setSelectedProjectId(project.id);
    if (accountRole === "citizen") {
      setActiveTab("projects");
    }
  };

  const handleOverviewProjectNavigate = (project: Project) => {
    navigate(`/project/${project.id}`);
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
            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-primary/30 bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">{accountRole === "politician" ? "Politician Dashboard" : "Citizen Dashboard"}</p>
              <h1 className="text-2xl font-bold text-foreground">
                {accountRole === "politician" ? "Manage Work and Respond to Citizens" : "Participate in Your Local Governance"}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {activeConstituency}, {activeSession.municipality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-accent/40 text-accent hover:text-twitter-blue"
              onClick={isAuthenticated ? handleSignOut : undefined}
              asChild={!isAuthenticated}
            >
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
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-twitter-blue/40 text-twitter-blue hover:bg-twitter-blue/5"
              onClick={handleOpenNotifications}
            >
              <Bell className="h-4 w-4" />
              Alerts
              {unreadNotifications > 0 && <span className="ml-1 text-xs text-twitter-blue">({unreadNotifications})</span>}
            </Button>
          </div>
        </div>

        {showNotifications && (
          <div className="surface-line mt-4 border-t-2 border-twitter-blue/40 pt-4">
            <h2 className="text-sm font-semibold text-twitter-blue">Notifications</h2>
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
              className={`rounded-none border-b px-3 py-2 text-sm font-semibold ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:border-accent/40 hover:text-accent"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-5 space-y-6">
            {accountRole === "citizen" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-primary">Constituency</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{activeConstituency}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-accent">Constituency Representatives</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{localPoliticians.length}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-civic-green">Ongoing Projects</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{ongoingLocalProjects.length}</p>
                  </div>
                  <div className="surface-line pt-4">
                    <p className="text-xs uppercase text-civic-amber">My Issues</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{myIssuesCount}</p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-base font-bold text-primary">Current and Ward Representatives</h2>
                  <p className="mb-3 text-xs text-muted-foreground">Profiles summarize publicly shared background, delivery metrics, and linked constituency projects.</p>
                  {isPoliticiansLoading ? (
                    <div className="flex justify-center">
                      <div className="w-full max-w-[280px]">
                        <ProjectSkeleton />
                      </div>
                    </div>
                  ) : isPoliticiansError ? (
                    <ErrorPanel message="Politician profiles failed to load." onRetry={() => refetchPoliticians()} />
                  ) : wardChairperson ? (
                    <div className="grid gap-4 xl:grid-cols-[minmax(320px,1.5fr)_minmax(0,1fr)]">
                      <div
                        className="surface-line min-h-[360px] cursor-pointer border-t-2 border-primary/40 pt-3 transition-colors hover:border-primary/70"
                        onClick={() => setSelectedRepresentative(wardChairperson)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedRepresentative(wardChairperson);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open full profile for ${wardChairperson.name}`}
                      >
                        <div className="relative h-72 w-full overflow-hidden border-b border-border/50 bg-neutral-100">
                          <img
                            src={wardChairperson.photo?.trim() || "/generated/politician-portrait.webp"}
                            alt={`${wardChairperson.name} profile`}
                            className="block h-full w-full object-cover object-center"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = "/generated/politician-portrait.webp";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Current Representative</p>
                          <p className="mt-1 text-base font-bold text-foreground">{wardChairperson.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{wardChairperson.party}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{firstSentence(wardChairperson.manifesto)}</p>
                          <p className="mt-2 text-[11px] font-semibold text-twitter-blue">View full profile</p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {wardCouncilMembers.length === 0 ? (
                          <div className="surface-line min-h-[210px] border-t-2 border-border pt-2">
                            <div className="p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Ward Representatives</p>
                              <p className="mt-2 text-sm text-muted-foreground">No ward representative records available yet.</p>
                            </div>
                          </div>
                        ) : (
                          wardCouncilMembers.map((member, index) => (
                            <div
                              key={member.id}
                              className={`surface-line min-h-[210px] cursor-pointer border-t-2 pt-2 transition-colors hover:border-primary/60 ${index % 2 === 0 ? "border-accent/40" : "border-twitter-blue/40"}`}
                              onClick={() => setSelectedRepresentative(member)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  setSelectedRepresentative(member);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`Open full profile for ${member.name}`}
                            >
                              <img
                                src={member.photo?.trim() || "/generated/past-politician.webp"}
                                alt={`${member.name} profile`}
                                className="h-24 w-full object-cover"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.src = "/generated/past-politician.webp";
                                }}
                              />
                              <div className="p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">Ward {index + 1} Representative</p>
                                <p className="mt-1 text-sm font-bold text-foreground">{member.name}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">{member.party}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{firstSentence(member.manifesto)}</p>
                                <p className="mt-2 text-[11px] font-semibold text-twitter-blue">View full profile</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="surface-line pt-4 text-sm text-muted-foreground">
                      No constituency lead found for Kathmandu 5 yet.
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="mb-3 text-base font-bold text-accent">Project Highlights</h2>
                  {isProjectsLoading || isProjectsFetching ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <ProjectSkeleton key={idx} />
                      ))}
                    </div>
                  ) : isProjectsError ? (
                    <ErrorPanel message="Projects failed to load." onRetry={() => refetchProjects()} />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {overviewProjectCards.map((project) => (
                        <ProjectCard key={project.id} project={project} onCardClick={handleOverviewProjectNavigate} />
                      ))}
                      {overviewProjectCards.length < 3 &&
                        Array.from({ length: 3 - overviewProjectCards.length }).map((_, idx) => (
                          <EmptyProjectSlot key={`overview-empty-${idx}`} />
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="surface-line border-t-2 border-primary/40 pt-5">
                  <h2 className="text-base font-bold text-primary">Performance Overview</h2>
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
                  <div className="surface-line border-t-2 border-accent/40 pt-4">
                    <p className="text-xs uppercase text-accent">Total Projects</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.activeProjects}</p>
                  </div>
                  <div className="surface-line border-t-2 border-civic-green/50 pt-4">
                    <p className="text-xs uppercase text-civic-green">Completion Rate</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.completionRate}%</p>
                  </div>
                  <div className="surface-line border-t-2 border-twitter-blue/40 pt-4">
                    <p className="text-xs uppercase text-twitter-blue">Feedback Handled</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{publicPerformance.feedbackHandled}</p>
                  </div>
                </div>

                <div className="surface-line border-t-2 border-twitter-blue/40 pt-4 space-y-3">
                  <h3 className="font-bold text-twitter-blue">Public Interaction Gallery</h3>
                  <p className="text-sm text-muted-foreground">Upload your community interaction photos. They will appear publicly in your Public Score Snapshot.</p>
                  <input
                    className="field-line"
                    placeholder="Optional caption"
                    value={publicImageCaption}
                    onChange={(event) => setPublicImageCaption(event.target.value)}
                  />
                  <label className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm text-muted-foreground">
                    <span>Upload images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="max-w-[200px] text-xs"
                      onChange={(event) => {
                        void handlePublicInteractionUpload(event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {politicianPublicImages.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {politicianPublicImages.slice(0, 6).map((item) => (
                        <div key={item.id} className="surface-line pt-2">
                          <img src={item.imageDataUrl} alt={item.caption || "Public interaction"} className="h-28 w-full object-cover" loading="lazy" />
                          <p className="mt-2 text-xs text-muted-foreground">{item.caption?.trim() || "Community interaction"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="mb-3 text-base font-bold text-accent">Your Active Project Highlights</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {overviewProjectCards.map((project) => (
                      <ProjectCard key={project.id} project={project} onCardClick={handleOverviewProjectNavigate} />
                    ))}
                    {overviewProjectCards.length < 3 &&
                      Array.from({ length: 3 - overviewProjectCards.length }).map((_, idx) => (
                        <EmptyProjectSlot key={`overview-poli-empty-${idx}`} />
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="mt-5 space-y-5">
            {accountRole === "citizen" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">Projects</h2>
                    <p className="text-base text-muted-foreground">Review and verify progress in {activeConstituency}</p>
                  </div>

                  {isProjectsLoading || isProjectsFetching ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <ProjectSkeleton key={idx} />
                      ))}
                    </div>
                  ) : isProjectsError ? (
                    <ErrorPanel message="Projects failed to load." onRetry={() => refetchProjects()} />
                  ) : filteredAndSortedProjects.length === 0 && (projectSearchQuery || projectStatusFilter !== "all") ? (
                    <div className="surface-line border-dashed border-accent/40 pt-8 text-center">
                      <p className="text-sm font-semibold text-foreground">No projects match your filters</p>
                      <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search or removing filters</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 rounded-none"
                        onClick={() => {
                          setProjectSearchQuery("");
                          setProjectStatusFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : filteredAndSortedProjects.length === 0 ? (
                    <div className="surface-line border-dashed border-accent/40 pt-8 text-center">
                      <p className="text-sm font-semibold text-foreground">No projects in your constituency yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Check back soon or explore other regions</p>
                      <Link href="/explore">
                        <Button variant="civic" size="sm" className="mt-3 rounded-none">
                          Explore all projects
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Search & Filters - Clean Layout */}
                      <div className="space-y-4">
                        {/* Search bar */}
                        <div>
                          <label htmlFor="project-search" className="text-sm font-semibold text-foreground block mb-2">
                            Search
                          </label>
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="project-search"
                              type="text"
                              placeholder="Search by name or category..."
                              className="field-line pl-10 w-full text-base"
                              value={projectSearchQuery}
                              onChange={(e) => setProjectSearchQuery(e.target.value)}
                            />
                            {projectSearchQuery && (
                              <button
                                onClick={() => setProjectSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Clear search"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Status filters */}
                        <div>
                          <label className="text-sm font-semibold text-foreground block mb-3">Status</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {(["all", "in-progress", "delayed", "completed", "not-started"] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => setProjectStatusFilter(status)}
                                className={`text-sm font-medium px-4 py-2 rounded border transition-all ${
                                  projectStatusFilter === status
                                    ? "border-civic-green bg-civic-green/10 text-civic-green"
                                    : "border-border text-foreground hover:border-civic-green/50"
                                }`}
                              >
                                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sort */}
                        <div>
                          <label htmlFor="sort-select" className="text-sm font-semibold text-foreground block mb-2">
                            Sort
                          </label>
                          <select
                            id="sort-select"
                            value={projectSortBy}
                            onChange={(e) => setProjectSortBy(e.target.value as typeof projectSortBy)}
                            className="field-line text-base py-2 w-full"
                          >
                            <option value="title">Name (A-Z)</option>
                            <option value="progress">Progress (High to Low)</option>
                            <option value="date">Newest First</option>
                          </select>
                        </div>
                      </div>

                      {/* Projects list as visual cards */}
                      <div className="space-y-2">
                        {filteredAndSortedProjects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setSelectedProjectId(project.id)}
                            className={`w-full text-left border transition-all p-4 rounded-lg cursor-pointer ${
                              selectedProjectId === project.id
                                ? "border-civic-green bg-civic-green/8"
                                : "border-border hover:border-civic-green/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base text-foreground">{project.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                              </div>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)} flex-shrink-0`}>
                                {getStatusIcon(project.status)}
                                <span className="hidden sm:inline">{project.status.replace("-", " ")}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-3 text-sm">
                              <span className="text-muted-foreground">{project.category}</span>
                              <span className="text-foreground font-medium">{project.progress}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div className="h-full bg-civic-green" style={{ width: `${project.progress}%` }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedProject && (
                    <>
                      {/* Project details preview */}
                      <div className="surface-line pt-4 pb-3 space-y-2">
                        <h4 className="font-semibold text-foreground">{selectedProject.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{selectedProject.category}</span>
                          <span>{selectedProject.progress}% complete</span>
                        </div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${selectedProject.progress}%` }} />
                        </div>
                      </div>

                      {/* Verification form */}
                      <div className="surface-line pt-4 space-y-4">
                        <div>
                          <h3 className="font-bold text-base text-foreground">Verify Progress</h3>
                          <p className="text-sm text-muted-foreground mt-1">Share what you've observed</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-foreground block mb-3">
                            Project Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {(["completed", "in-progress", "delayed", "not-started"] as VerificationVote[]).map((vote) => (
                              <button
                                key={vote}
                                type="button"
                                className={`border px-4 py-2 text-sm font-medium transition-all rounded ${
                                  verificationVote === vote
                                    ? "border-civic-green bg-civic-green/10 text-civic-green"
                                    : "border-border text-foreground hover:border-civic-green/50"
                                }`}
                                onClick={() => setVerificationVote(vote)}
                              >
                                {voteLabel[vote]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="verification-notes" className="text-sm font-semibold text-foreground block mb-2">
                            Notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                          </label>
                          <textarea
                            id="verification-notes"
                            className="field-line min-h-24 text-base resize-none"
                            placeholder="What have you observed about this project?"
                            value={verificationNote}
                            onChange={(e) => setVerificationNote(e.target.value)}
                          />
                        </div>

                        <label className="border border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-civic-green/50 transition-colors">
                          <span className="text-sm font-semibold text-foreground block">Add photos or documents</span>
                          <input type="file" multiple className="hidden" onChange={(event) => handleVerificationEvidence(event.target.files)} />
                          <p className="text-xs text-muted-foreground mt-2">Optional • PNG, JPG, PDF up to 5MB each</p>
                        </label>

                        {currentUserVerification && (
                          <div className="bg-civic-green/5 border border-civic-green/30 rounded-lg p-3">
                            <p className="text-sm font-semibold text-civic-green">
                              Already verified: {voteLabel[currentUserVerification.vote]}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="civic"
                          className="w-full"
                          onClick={handleSubmitVerification}
                          disabled={!isAuthenticated || !selectedProjectId || verificationSubmitting}
                        >
                          {verificationSubmitting ? "Submitting..." : "Submit Verification"}
                        </Button>
                      </div>

                      {/* Comment form */}
                      <div className="surface-line pt-4 space-y-4">
                        <div>
                          <h3 className="font-bold text-base text-foreground">Add Comment</h3>
                          <p className="text-sm text-muted-foreground mt-1">Share updates or ask questions</p>
                        </div>

                        <textarea
                          className="field-line min-h-24 text-base resize-none"
                          placeholder="What would you like to share?"
                          value={commentDraft}
                          onChange={(e) => setCommentDraft(e.target.value)}
                        />

                        <label className="border border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-civic-green/50 transition-colors">
                          <span className="text-sm font-semibold text-foreground block">Add photos or documents</span>
                          <input type="file" multiple className="hidden" onChange={(event) => handleCommentEvidence(event.target.files)} />
                          <p className="text-xs text-muted-foreground mt-2">Optional • PNG, JPG, PDF up to 5MB each</p>
                        </label>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSubmitComment}
                          disabled={!isAuthenticated || !selectedProjectId || !commentDraft.trim() || commentSubmitting}
                        >
                          {commentSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </>
                  ) || (
                    <div className="surface-line pt-16 pb-16 text-center">
                      <p className="text-2xl font-bold text-foreground">Select a project</p>
                      <p className="text-muted-foreground mt-2">Choose from the list to get started</p>
                    </div>
                  )}
                </div>

                {/* Verification confirmation dialog */}
                {showVerificationConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="surface-line max-w-sm w-full p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-foreground">Confirm your verification</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          You're marking "{selectedProject?.title}" as <strong>{voteLabel[verificationVote]}</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none"
                          onClick={() => setShowVerificationConfirm(false)}
                          disabled={verificationSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="civic"
                          size="sm"
                          className="flex-1 rounded-none"
                          onClick={confirmSubmitVerification}
                          disabled={verificationSubmitting}
                        >
                          {verificationSubmitting ? "Confirming..." : "Confirm"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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

                <div className="surface-line border-t-2 border-civic-green/50 pt-4 space-y-3">
                  <h3 className="font-bold text-civic-green">Post Progress Update</h3>
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
                    <ProjectCard key={project.id} project={project} disableNavigation onCardClick={handleDashboardProjectClick} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="mt-5 space-y-5">
            <div className="surface-line border-t-2 border-twitter-blue/40 pt-4">
              <h2 className="mb-3 text-base font-bold text-twitter-blue">Recent Updates & Activity</h2>
              <ActivityFeed items={activityItems} />
            </div>

            {accountRole === "citizen" && (
              <div className="surface-line border-t-2 border-civic-amber/60 pt-4 space-y-3">
                <h3 className="font-bold text-civic-amber">My Reported Issues</h3>
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
              <div className="surface-line border-t-2 border-civic-amber/60 pt-4 space-y-3">
                <h3 className="font-bold text-civic-amber">Issue Response Inbox</h3>
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
                {issues.length === 0 && <p className="text-sm text-muted-foreground">No constituency issues reported yet.</p>}
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
              <input className="field-line" placeholder={activeConstituency} />
              <Button variant="civic" size="sm" className="rounded-none">Save Changes</Button>
            </div>
          </div>
        )}

        {selectedRepresentative && (
          <PoliticianPanel
            politician={selectedRepresentative}
            projects={allProjects}
            onClose={() => setSelectedRepresentative(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountHub;
