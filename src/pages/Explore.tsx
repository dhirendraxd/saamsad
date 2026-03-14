import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PoliticianCard from "@/components/PoliticianCard";
import ProjectCard from "@/components/ProjectCard";
import PoliticianPanel from "@/components/PoliticianPanel";
import { mockPoliticians, mockProjects, getScoreColor } from "@/data/mockData";
import type { Politician } from "@/data/mockData";
import { Trophy } from "lucide-react";

const tabs = ["Politicians", "Projects", "Transparency Leaders"] as const;
type Tab = (typeof tabs)[number];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Politicians");
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);

  const sortedByTransparency = [...mockPoliticians].sort((a, b) => b.transparencyScore - a.transparencyScore);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Explore</h1>
        <p className="text-muted-foreground mb-8">Discover politicians, track projects, and see who leads in transparency.</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Politicians */}
        {activeTab === "Politicians" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPoliticians.map((p) => (
              <PoliticianCard key={p.id} politician={p} onClick={() => setSelectedPolitician(p)} />
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab === "Projects" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        {/* Transparency Leaders */}
        {activeTab === "Transparency Leaders" && (
          <div className="space-y-3">
            {sortedByTransparency.map((p, i) => (
              <div
                key={p.id}
                onClick={() => setSelectedPolitician(p)}
                className="flex items-center gap-4 bg-card rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all cursor-pointer border border-transparent hover:border-accent/20"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg ${
                  i === 0 ? "bg-accent/10 text-accent" : i === 1 ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i === 0 ? <Trophy className="w-5 h-5" /> : `#${i + 1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.constituency} · {p.party}</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className={`text-xl font-extrabold ${getScoreColor(p.transparencyScore)}`}>{p.transparencyScore}%</p>
                  <p className="text-[10px] text-muted-foreground">Transparency</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xl font-extrabold text-foreground">{p.completedPromises}/{p.totalPromises}</p>
                  <p className="text-[10px] text-muted-foreground">Promises</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-extrabold ${getScoreColor(p.communityTrust)}`}>{p.communityTrust}%</p>
                  <p className="text-[10px] text-muted-foreground">Trust</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      {selectedPolitician && <PoliticianPanel politician={selectedPolitician} onClose={() => setSelectedPolitician(null)} />}
    </div>
  );
};

export default ExplorePage;
