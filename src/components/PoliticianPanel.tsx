import { X, User, Award, MapPin, FileText, BarChart3, MessageSquare } from "lucide-react";
import type { Politician, Project } from "@/lib/api/contracts";
import ScoreDashboard from "@/components/ScoreDashboard";
import ProjectCard from "@/components/ProjectCard";

interface PoliticianPanelProps {
  politician: Politician;
  projects?: Project[];
  onClose: () => void;
}

const PoliticianPanel = ({ politician, projects, onClose }: PoliticianPanelProps) => {
  const politicianProjects = (projects ?? []).filter((project) => project.politicianId === politician.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-background overflow-y-auto shadow-2xl animate-fade-up">
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-foreground">Politician Profile</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground transition-colors hover:text-twitter-blue">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-foreground">{politician.name}</h3>
                {politician.verified && (
                  <span className="w-5 h-5 rounded-full bg-civic-green flex items-center justify-center">
                    <span className="text-[10px] text-civic-green-foreground">✓</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{politician.party}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{politician.constituency}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          {politician.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {politician.badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-none border-0 border-b border-border px-0 pb-1 text-xs font-medium text-foreground">
                  <Award className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Scores */}
          <ScoreDashboard
            accountability={politician.accountabilityScore}
            transparency={politician.transparencyScore}
            communityTrust={politician.communityTrust}
            engagement={politician.engagementPoints > 100 ? 100 : politician.engagementPoints}
            completedPromises={politician.completedPromises}
            totalPromises={politician.totalPromises}
          />

          {/* Promise Stats */}
          <div className="surface-line pt-5">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Promise Overview
            </h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Total", value: politician.totalPromises, color: "text-foreground" },
                { label: "Completed", value: politician.completedPromises, color: "text-civic-green" },
                { label: "Delayed", value: politician.delayedPromises, color: "text-civic-green" },
                { label: "Failed", value: politician.failedPromises, color: "text-destructive" },
              ].map((s) => (
                <div key={s.label} className="border-t border-border pt-2">
                  <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Manifesto */}
          <div className="surface-line pt-5">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Manifesto
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{politician.manifesto}</p>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Projects ({politicianProjects.length})
            </h4>
            {politicianProjects.length > 0 ? (
              <div className="space-y-3">
                {politicianProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="surface-line pt-4 text-sm text-muted-foreground">
                No projects are available for this profile yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticianPanel;
