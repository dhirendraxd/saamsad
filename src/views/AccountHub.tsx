"use client";

import { type ElementType, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import type { ActivityItem } from "@/components/ActivityFeed";
import { User, MapPin, Shield, Settings, FolderOpen, Activity, Eye, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { Navigate, useLocation } from "@/lib/router";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";

type Role = "citizen" | "politician";
type Tab = "overview" | "projects" | "activity" | "transparency" | "settings";

interface AccountHubProps {
  targetRole?: Role;
}

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

const AccountHub = ({ targetRole }: AccountHubProps) => {
  const { session, isAuthenticated, isReady, role, signOut } = useAuth();
  const location = useLocation();
  const { data: politicians = [] } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const accountRole: Role = role === "politician" ? "politician" : "citizen";

  const politician = useMemo(() => {
    if (!session || accountRole !== "politician") {
      return null;
    }

    return (
      politicians.find((candidate) => candidate.id === session.userId) ??
      politicians.find(
        (candidate) =>
          candidate.name.trim().toLowerCase() === session.name.trim().toLowerCase(),
      ) ??
      null
    );
  }, [accountRole, politicians, session]);

  const localProjects = useMemo(() => {
    if (!session) {
      return [];
    }

    if (accountRole === "politician" && politician) {
      return projects.filter((project) => project.politicianId === politician.id);
    }

    return projects.filter((project) => project.ward === session.ward);
  }, [accountRole, politician, projects, session]);

  const visibleProjects =
    localProjects.length > 0 ? localProjects.slice(0, 6) : projects.slice(0, 4);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Loading account...</div>
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return <Navigate to="/auth" replace />;
  }

  const dashboardRoute = accountRole === "politician" ? "/dashboard/politician" : "/dashboard/citizen";
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnAccount = location.pathname === "/account";
  const isMismatchedDashboard = isOnDashboard && location.pathname !== dashboardRoute;

  if (targetRole && targetRole !== accountRole) {
    return <Navigate to={dashboardRoute} replace />;
  }

  if (isOnAccount || isMismatchedDashboard) {
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
          <Button variant="outline" size="sm" className="rounded-none self-start" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>

        <div className="surface-line mb-6 pt-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground">{session.name}</h1>
                {accountRole === "politician" && session.verified && (
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
                <span>{accountRole === "politician" ? politician?.constituency ?? session.ward : `${session.ward}, ${session.municipality}`}</span>
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
            {accountRole === "politician" && politician && (
              <ScoreDashboard
                accountability={politician.accountabilityScore}
                transparency={politician.transparencyScore}
                communityTrust={politician.communityTrust}
                engagement={Math.min(politician.engagementPoints, 100)}
                completedPromises={politician.completedPromises}
                totalPromises={politician.totalPromises}
              />
            )}
            {accountRole === "citizen" && (
              <div className="surface-line pt-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Citizen Account</h2>
                <p className="text-sm text-muted-foreground">
                  You are verified for {session.ward}. Use this page to follow local projects, upload evidence, and share status checks.
                </p>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">
                {accountRole === "citizen" ? "Local Projects" : "Your Projects"}
              </h2>
              {isProjectsLoading ? (
                <div className="surface-line pt-4 text-sm text-muted-foreground">Loading projects...</div>
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
            {isProjectsLoading ? (
              <div className="surface-line pt-4 text-sm text-muted-foreground">Loading projects...</div>
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
