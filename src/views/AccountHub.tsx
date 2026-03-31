"use client";

import { type ElementType, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import type { ActivityItem } from "@/components/ActivityFeed";
import { User, MapPin, Shield, Settings, FolderOpen, Activity, Eye, Upload, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { Navigate, useLocation, Link } from "@/lib/router";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";

type Role = "citizen" | "politician";
type Tab = "overview" | "projects" | "activity" | "transparency" | "settings";

interface AccountHubProps {
  targetRole?: Role;
}

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
];

const ProjectSkeleton = () => (
  <div className="surface-line h-28 rounded-xl animate-pulse" aria-hidden="true" />
);

const StatSkeleton = () => (
  <div className="surface-line h-40 rounded-xl animate-pulse" aria-hidden="true" />
);

const ErrorPanel = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="surface-line flex items-center justify-between gap-3 pt-4" role="alert">
    <p className="text-sm text-red-600">{message}</p>
    <Button variant="outline" size="sm" className="rounded-none" onClick={onRetry}>Retry</Button>
  </div>
);

const AccountHub = ({ targetRole }: AccountHubProps) => {
  const { session, isAuthenticated, isReady, role, signOut } = useAuth();
  const location = useLocation();
  const {
    data: politicians = [],
    isLoading: isPoliticiansLoading,
    isError: isPoliticiansError,
    refetch: refetchPoliticians,
  } = usePoliticiansQuery();
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    isFetching: isProjectsFetching,
    refetch: refetchProjects,
  } = useProjectsQuery();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const accountRole: Role = isAuthenticated
    ? role === "politician"
      ? "politician"
      : "citizen"
    : targetRole ?? "citizen";

  const demoSession = accountRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;

  const politician = useMemo(() => {
    if (!activeSession || accountRole !== "politician") {
      return null;
    }

    return (
      politicians.find((candidate) => candidate.id === activeSession.userId) ??
      politicians.find(
        (candidate) =>
          candidate.name.trim().toLowerCase() === activeSession.name.trim().toLowerCase(),
      ) ??
      null
    );
  }, [accountRole, politicians, activeSession]);

  const safeProjects = isProjectsError ? [] : projects;

  const localProjects = useMemo(() => {
    if (!activeSession) {
      return [];
    }

    if (accountRole === "politician" && politician) {
      return safeProjects.filter((project) => project.politicianId === politician.id);
    }

    return safeProjects.filter((project) => project.ward === activeSession.ward);
  }, [accountRole, politician, safeProjects, activeSession]);

  const visibleProjects =
    localProjects.length > 0 ? localProjects.slice(0, 6) : safeProjects.slice(0, 4);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Loading account...</div>
      </div>
    );
  }

  const demoSession = targetRole === "politician" ? DEMO_POLITICIAN : DEMO_CITIZEN;
  const activeSession = session ?? demoSession;

  const dashboardRoute = accountRole === "politician" ? "/dashboard/politician" : "/dashboard/citizen";
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnAccount = location.pathname === "/account";
  const isMismatchedDashboard = isOnDashboard && location.pathname !== dashboardRoute;

  if (targetRole && targetRole !== accountRole && isAuthenticated) {
    return <Navigate to={dashboardRoute} replace />;
  }

  if ((isOnAccount || isMismatchedDashboard) && isAuthenticated) {
    return <Navigate to={dashboardRoute} replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    setActiveTab("overview");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{accountRole === "politician" ? "Politician Dashboard" : "Citizen Dashboard"}</p>
                <h1 className="text-2xl font-bold text-foreground">
                  {accountRole === "politician" ? "Track promises and publish transparency updates" : "Follow local progress and keep leaders accountable"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {accountRole === "politician"
                    ? "See your portfolio, add documents, and keep your constituency informed."
                    : "See ward projects, upload evidence, and verify what’s happening on the ground."}
                </p>
              </div>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" className="rounded-none self-start" onClick={handleSignOut}>
                  Sign out
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="rounded-none self-start" asChild>
                  <Link to="/auth"><LogIn className="w-4 h-4 mr-1" />Sign in</Link>
                </Button>
              )}
            </div>

        <div className="surface-line mb-6 pt-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground">{activeSession.name}</h1>
                {accountRole === "politician" && activeSession.verified && (
                  <span className="w-5 h-5 rounded-full bg-civic-green flex items-center justify-center">
                    <span className="text-[10px] text-civic-green-foreground">✓</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {accountRole === "politician" ? politician?.party ?? "Politician" : "Citizen"}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{accountRole === "politician" ? politician?.constituency ?? activeSession.ward : `${activeSession.ward}, ${activeSession.municipality}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-6 overflow-x-auto border-b border-border">
          {tabs.filter((tab) => accountRole === "citizen" ? tab.key !== "transparency" : true).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-link flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key ? "border-foreground text-foreground" : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {accountRole === "politician" && (
              <>
                {isPoliticiansLoading && <StatSkeleton />}
                {isPoliticiansError && (
                  <ErrorPanel
                    message="Couldn't load your transparency stats. Please retry."
                    onRetry={() => refetchPoliticians()}
                  />
                )}
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
                  <div className="surface-line pt-6 text-sm text-muted-foreground">
                    We couldn’t match your profile to a politician record yet.
                  </div>
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
              <h2 className="text-lg font-bold text-foreground mb-4">
                {accountRole === "citizen" ? "Local Projects" : "Your Projects"}
              </h2>
              {isProjectsLoading || isProjectsFetching ? (
                <div className="grid sm:grid-cols-2 gap-4" aria-live="polite">
                {Array.from({ length: 4 }).map((_, idx) => <ProjectSkeleton key={idx} />)}
                </div>
              ) : isProjectsError ? (
                <ErrorPanel
                  message="Projects failed to load. Check your connection and retry."
                  onRetry={() => refetchProjects()}
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            {accountRole === "politician" && (
              <div className="flex justify-end mb-4">
                <Button variant="civic" size="sm"><Plus className="w-4 h-4 mr-1" />Add Project</Button>
              </div>
            )}
            {isProjectsLoading || isProjectsFetching ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => <ProjectSkeleton key={idx} />)}
              </div>
            ) : isProjectsError ? (
              <ErrorPanel
                message="Projects failed to load. Check your connection and retry."
                onRetry={() => refetchProjects()}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <ActivityFeed items={mockActivity} />
        )}

        {activeTab === "transparency" && accountRole === "politician" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="civic" size="sm"><Upload className="w-4 h-4 mr-1" />Upload Document</Button>
            </div>
            {["Asset Declaration 2025", "Campaign Expense Report", "Policy Note: Clean Water"].map((doc) => (
              <div key={doc} className="surface-line flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium text-foreground">{doc}</p>
                  <p className="text-xs text-muted-foreground">Uploaded Jan 2026</p>
                </div>
                <span className="border-b border-civic-green/40 pb-0.5 text-xs font-medium text-civic-green">Verified</span>
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
                        ? session.name
                        : field === "Ward"
                          ? session.ward
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
    </div>
  );
};

export default AccountHub;
