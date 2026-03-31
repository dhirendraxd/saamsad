"use client";

import { type ElementType, useMemo, useState } from "react";
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

const mockActivity: ActivityItem[] = [
  { type: "verification", author: "You", content: "Verified 'Community Health Center' as In Progress", date: "2026-03-12" },
  { type: "comment", author: "You", content: "Left a comment on Rural Road Rehabilitation project", date: "2026-03-10" },
  { type: "evidence", author: "You", content: "Uploaded 2 photos for Women's Skill Training Center", date: "2026-03-08" },
  { type: "comment", author: "You", content: "Commented on Coastal Erosion Prevention project update", date: "2026-03-05" },
  { type: "verification", author: "Team", content: "Verified 'Road Widening' as Completed", date: "2026-02-28" },
  { type: "comment", author: "Analyst", content: "Flagged delay on Bridge Expansion", date: "2026-02-22" },
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

function SidebarLink({ icon: Icon, label, href, active, onClick }: { icon: ElementType; label: string; href?: string; active?: boolean; onClick?: () => void }) {
  const Component = href ? Link : ("button" as any);
  return (
    <Component
      to={href as string}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition text-sm font-medium ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Component>
  );
}

const AccountHub = ({ targetRole }: { targetRole?: Role }) => {
  const { session, isAuthenticated, isReady, role, signOut } = useAuth();
  const location = useLocation();
  const { data: politicians = [], isLoading: isPoliticiansLoading, isError: isPoliticiansError, refetch: refetchPoliticians } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading, isError: isProjectsError, isFetching: isProjectsFetching, refetch: refetchProjects } = useProjectsQuery();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", category: "Infrastructure", expectedCompletion: "" });
  const [transparencyDocs, setTransparencyDocs] = useState([
    { title: "Asset Declaration 2025", uploaded: "Jan 2026", status: "Verified" },
    { title: "Campaign Expense Report", uploaded: "Jan 2026", status: "Verified" },
    { title: "Policy Note: Clean Water", uploaded: "Jan 2026", status: "Verified" },
  ]);
  const [newDocTitle, setNewDocTitle] = useState("");

  const accountRole: Role = isAuthenticated ? (role === "politician" ? "politician" : "citizen") : targetRole ?? "citizen";
  const demoSession = accountRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;

  const politician = useMemo(() => {
    if (!activeSession || accountRole !== "politician") return null;
    return (
      politicians.find((candidate) => candidate.id === activeSession.userId) ||
      politicians.find((candidate) => candidate.name.trim().toLowerCase() === activeSession.name.trim().toLowerCase()) ||
      null
    );
  }, [accountRole, politicians, activeSession]);

  const safeProjects = isProjectsError ? [] : projects;
  const allProjects = useMemo(() => [...createdProjects, ...safeProjects], [createdProjects, safeProjects]);
  const localProjects = useMemo(() => {
    if (!activeSession) return [];
    if (accountRole === "politician" && politician) return allProjects.filter((project) => project.politicianId === politician.id);
    return allProjects.filter((project) => project.ward === activeSession.ward);
  }, [accountRole, politician, allProjects, activeSession]);
  const visibleProjects = localProjects.length > 0 ? localProjects.slice(0, 6) : allProjects.slice(0, 4);

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
    setShowProjectForm(false);
    setNewProject({ title: "", category: "Infrastructure", expectedCompletion: "" });
    setActiveTab("projects");
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
      <div className="flex gap-6 px-4 py-6 lg:px-10">
        <aside className="hidden lg:flex w-64 flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10" />
            <div>
              <p className="text-sm font-semibold text-foreground">Samsad</p>
              <p className="text-xs text-muted-foreground">Transparency OS</p>
            </div>
          </div>
          <nav className="space-y-2 text-sm">
            <SidebarLink icon={Home} label="Home" href="/" />
            <SidebarLink icon={Users} label="Patients" href="/explore" />
            <SidebarLink icon={Layers} label="Careboard" href="/dashboard" active />
            <SidebarLink icon={BarChart2} label="Dashboard" href="/regions" />
            <SidebarLink icon={Settings2} label="Automate" href="/education" />
            <SidebarLink icon={Megaphone} label="Campaign" href="/project" />
          </nav>
          <div className="mt-auto space-y-3 text-sm">
            <SidebarLink icon={Settings} label="Settings" href="/account" />
            <SidebarLink icon={LogIn} label={isAuthenticated ? "Sign out" : "Sign in"} onClick={isAuthenticated ? handleSignOut : undefined} href={isAuthenticated ? undefined : "/auth"} />
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
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-border px-3 py-2 bg-white">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input className="outline-none text-sm bg-transparent" placeholder="Search projects or updates" />
              </div>
              <Button variant="outline" size="sm" className="rounded-none">
                <Bell className="w-4 h-4 mr-1" />
                Alerts
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {"Tasks Timeline Pending Files".split(" ").map((label, idx) => (
              <button
                key={label}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${idx === 0 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
                type="button"
              >
                {label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-none">Sort</Button>
              <Button variant="outline" size="sm" className="rounded-none">Add filter</Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-2">
            {tabs
              .filter((tab) => (accountRole === "citizen" ? tab.key !== "transparency" : true))
              .map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    activeTab === tab.key ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {accountRole === "politician" && (
                    <>
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
                    <div className="surface-line pt-6">
                      <h2 className="text-lg font-bold text-foreground mb-2">Citizen Account</h2>
                      <p className="text-sm text-muted-foreground">
                        You are verified for {activeSession.ward}. Use this page to follow local projects, upload evidence, and share status checks.
                      </p>
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
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-4">
                  {accountRole === "politician" && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Draft and publish projects for your constituency.</p>
                      <Button variant="civic" size="sm" onClick={() => setShowProjectForm((v) => !v)} className="rounded-none">
                        <Plus className="w-4 h-4 mr-1" />
                        {showProjectForm ? "Close form" : "Add Project"}
                      </Button>
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

              {activeTab === "activity" && <ActivityFeed items={mockActivity} />}

              {activeTab === "transparency" && accountRole === "politician" && (
                <div className="space-y-4">
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

            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
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
                  {mockActivity.slice(0, 6).map((item, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHub;
