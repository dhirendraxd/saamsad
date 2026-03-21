"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import PoliticianCard from "@/components/PoliticianCard";
import ProjectCard from "@/components/ProjectCard";
import PoliticianPanel from "@/components/PoliticianPanel";
import { getScoreColor } from "@/data/mockData";
import type { Politician } from "@/lib/api/contracts";
import { Trophy } from "lucide-react";
import { usePoliticiansQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";

const tabs = ["Politicians", "Projects", "Transparency Leaders"] as const;
type Tab = (typeof tabs)[number];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Politicians");
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);
  const { data: politicians = [], isLoading: isPoliticiansLoading } = usePoliticiansQuery();
  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();

  const sortedByTransparency = useMemo(
    () => [...politicians].sort((a, b) => b.transparencyScore - a.transparencyScore),
    [politicians],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Explore</h1>
        <p className="text-muted-foreground mb-8">Browse public representatives, follow project progress, and check transparency scores.</p>

        {/* Tabs */}
        <div className="mb-8 flex w-fit gap-6 overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-link ${
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Politicians */}
        {activeTab === "Politicians" && (
          isPoliticiansLoading ? (
            <div className="surface-line py-6 text-sm text-muted-foreground">Loading politicians...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {politicians.map((politician) => (
                <PoliticianCard
                  key={politician.id}
                  politician={politician}
                  onClick={() => setSelectedPolitician(politician)}
                />
              ))}
            </div>
          )
        )}

        {/* Projects */}
        {activeTab === "Projects" && (
          isProjectsLoading ? (
            <div className="surface-line py-6 text-sm text-muted-foreground">Loading projects...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )
        )}

        {/* Transparency Leaders */}
        {activeTab === "Transparency Leaders" && (
          isPoliticiansLoading ? (
            <div className="surface-line py-6 text-sm text-muted-foreground">Loading rankings...</div>
          ) : (
            <div className="space-y-3">
              {sortedByTransparency.map((politician, index) => (
                <div
                  key={politician.id}
                  onClick={() => setSelectedPolitician(politician)}
                  className="surface-line flex cursor-pointer items-center gap-4 pt-5 transition-colors hover:border-accent/30"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg ${
                    index === 0 ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                  }`}>
                    {index === 0 ? <Trophy className="w-5 h-5" /> : `#${index + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{politician.name}</h3>
                    <p className="text-xs text-muted-foreground">{politician.constituency} · {politician.party}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className={`text-xl font-extrabold ${getScoreColor(politician.transparencyScore)}`}>{politician.transparencyScore}%</p>
                    <p className="text-[10px] text-muted-foreground">Transparency</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xl font-extrabold text-foreground">{politician.completedPromises}/{politician.totalPromises}</p>
                    <p className="text-[10px] text-muted-foreground">Promises</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-extrabold ${getScoreColor(politician.communityTrust)}`}>{politician.communityTrust}%</p>
                    <p className="text-[10px] text-muted-foreground">Trust</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {selectedPolitician && (
        <PoliticianPanel
          politician={selectedPolitician}
          projects={projects}
          onClose={() => setSelectedPolitician(null)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
