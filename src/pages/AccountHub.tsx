import { type ElementType, type FormEvent, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import type { ActivityItem } from "@/components/ActivityFeed";
import { User, MapPin, Shield, Settings, FolderOpen, Activity, Eye, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IdentityRegistrationInput } from "@/lib/api/contracts";
import { useAuth } from "@/lib/auth/useAuth";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";

type Role = "citizen" | "politician";
type Tab = "overview" | "projects" | "activity" | "transparency" | "settings";

const tabs: { key: Tab; label: string; icon: ElementType }[] = [
  { key: "overview", label: "Overview", icon: Eye },
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "transparency", label: "Transparency", icon: Shield },
  { key: "settings", label: "Settings", icon: Settings },
];

const initialIdentityForm: IdentityRegistrationInput = {
  nationalId: "",
  name: "",
  ward: "",
  municipality: "",
};

const mockActivity: ActivityItem[] = [
  { type: "verification", author: "You", content: "Verified 'Community Health Center' as In Progress", date: "2026-03-12" },
  { type: "comment", author: "You", content: "Left a comment on Rural Road Rehabilitation project", date: "2026-03-10" },
  { type: "evidence", author: "You", content: "Uploaded 2 photos for Women's Skill Training Center", date: "2026-03-08" },
  { type: "comment", author: "You", content: "Commented on Coastal Erosion Prevention project update", date: "2026-03-05" },
];

const AccountHub = () => {
  const { session, isAuthenticated, role, signInWithIdentity, signOut } = useAuth();
  const { data: politicians = [] } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [identityForm, setIdentityForm] = useState<IdentityRegistrationInput>(initialIdentityForm);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingIdentity, setIsSubmittingIdentity] = useState(false);

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

  const handleIdentitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmittingIdentity(true);

    try {
      await signInWithIdentity(identityForm);
      setActiveTab("overview");
    } catch {
      setAuthError("Unable to verify identity right now. Please check your input and try again.");
    } finally {
      setIsSubmittingIdentity(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIdentityForm(initialIdentityForm);
    setActiveTab("overview");
    setAuthError(null);
  };

  if (!isAuthenticated || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10">
          <div className="max-w-xl bg-card rounded-2xl shadow-card p-6">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Identity Verification</p>
            <h1 className="text-2xl font-extrabold text-foreground mb-3">Sign in to your Account Hub</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your civic identity details. The platform verifies whether your account is a citizen or politician profile.
            </p>

            <form className="space-y-4" onSubmit={handleIdentitySubmit}>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">National ID</label>
                <input
                  className="w-full bg-muted border rounded-none px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  value={identityForm.nationalId}
                  onChange={(event) =>
                    setIdentityForm((prev) => ({ ...prev, nationalId: event.target.value }))
                  }
                  placeholder="e.g. CZN-00012345"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
                <input
                  className="w-full bg-muted border rounded-none px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  value={identityForm.name}
                  onChange={(event) =>
                    setIdentityForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="As shown on official record"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Ward</label>
                  <input
                    className="w-full bg-muted border rounded-none px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    value={identityForm.ward}
                    onChange={(event) =>
                      setIdentityForm((prev) => ({ ...prev, ward: event.target.value }))
                    }
                    placeholder="e.g. Ward 5"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Municipality</label>
                  <input
                    className="w-full bg-muted border rounded-none px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    value={identityForm.municipality}
                    onChange={(event) =>
                      setIdentityForm((prev) => ({ ...prev, municipality: event.target.value }))
                    }
                    placeholder="e.g. Riverside Municipality"
                    required
                  />
                </div>
              </div>

              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}

              <Button variant="civic" className="rounded-none" disabled={isSubmittingIdentity}>
                {isSubmittingIdentity ? "Verifying..." : "Verify Identity"}
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex justify-end mb-6">
          <Button variant="outline" size="sm" className="rounded-none" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
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

        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.filter((tab) => accountRole === "citizen" ? tab.key !== "transparency" : true).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
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
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-foreground mb-2">Citizen Account</h2>
                <p className="text-sm text-muted-foreground">
                  You are verified for {session.ward}. Use this hub to follow local projects, submit evidence, and participate in project verification.
                </p>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">
                {accountRole === "citizen" ? "Local Projects" : "Your Projects"}
              </h2>
              {isProjectsLoading ? (
                <div className="bg-card rounded-xl border p-4 text-sm text-muted-foreground">Loading projects...</div>
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
              <div className="bg-card rounded-xl border p-4 text-sm text-muted-foreground">Loading projects...</div>
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
            {["Asset Declaration 2025", "Campaign Expenditure Report", "Policy Proposal: Clean Water"].map((doc) => (
              <div key={doc} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{doc}</p>
                  <p className="text-xs text-muted-foreground">Uploaded Jan 2026</p>
                </div>
                <span className="text-xs bg-civic-green/10 text-civic-green px-2 py-1 rounded-full font-medium">Verified</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-card rounded-2xl p-6 shadow-card max-w-lg">
            <h3 className="font-bold text-foreground mb-4">Profile Settings</h3>
            <div className="space-y-4">
              {["Display Name", "Email", "Phone", "Ward"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground block mb-1">{field}</label>
                  <input
                    className="w-full bg-muted border rounded-none px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
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
      <Footer />
    </div>
  );
};

export default AccountHub;
