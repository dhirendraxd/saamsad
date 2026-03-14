import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import { mockPoliticians, mockProjects } from "@/data/mockData";
import type { ActivityItem } from "@/components/ActivityFeed";
import { User, MapPin, Shield, Settings, FolderOpen, Activity, Eye, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Role = "citizen" | "politician";
type Tab = "overview" | "projects" | "activity" | "transparency" | "settings";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
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
  { type: "comment", author: "You", content: "Commented on Coastal Erosion Prevention discussion", date: "2026-03-05" },
];

const AccountHub = () => {
  const [role, setRole] = useState<Role>("citizen");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const politician = mockPoliticians[0]; // Mock logged in politician
  const localProjects = mockProjects.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        {/* Role switcher (demo only) */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setRole("citizen")} className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${role === "citizen" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
            Citizen View
          </button>
          <button onClick={() => setRole("politician")} className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${role === "politician" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
            Politician View
          </button>
        </div>

        {/* Profile header */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground">
                  {role === "politician" ? politician.name : "Jane Citizen"}
                </h1>
                {role === "politician" && (
                  <span className="w-5 h-5 rounded-full bg-civic-green flex items-center justify-center">
                    <span className="text-[10px] text-civic-green-foreground">✓</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {role === "politician" ? politician.party : "Citizen"}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{role === "politician" ? politician.constituency : "Riverside Ward 5"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.filter((t) => role === "citizen" ? t.key !== "transparency" : true).map((tab) => (
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

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {role === "politician" && (
              <ScoreDashboard
                accountability={politician.accountabilityScore}
                transparency={politician.transparencyScore}
                communityTrust={politician.communityTrust}
                engagement={Math.min(politician.engagementPoints, 100)}
                completedPromises={politician.completedPromises}
                totalPromises={politician.totalPromises}
              />
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">
                {role === "citizen" ? "Local Projects" : "Your Projects"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {localProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            {role === "politician" && (
              <div className="flex justify-end mb-4">
                <Button variant="civic" size="sm"><Plus className="w-4 h-4 mr-1" />Add Project</Button>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <ActivityFeed items={mockActivity} />
        )}

        {/* Transparency Tab (politician only) */}
        {activeTab === "transparency" && role === "politician" && (
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

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-card rounded-2xl p-6 shadow-card max-w-lg">
            <h3 className="font-bold text-foreground mb-4">Profile Settings</h3>
            <div className="space-y-4">
              {["Display Name", "Email", "Phone", "Ward"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground block mb-1">{field}</label>
                  <input className="w-full bg-muted border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder={field} />
                </div>
              ))}
              <Button variant="civic" className="mt-2">Save Changes</Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AccountHub;
