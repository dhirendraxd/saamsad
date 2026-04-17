import { X, User, Award, MapPin, FileText, BarChart3, MessageSquare } from "lucide-react";
import type { Politician, Project } from "@/lib/api/contracts";
import ScoreDashboard from "@/components/ScoreDashboard";
import ProjectCard from "@/components/ProjectCard";

interface PoliticianPanelProps {
  politician: Politician;
  projects?: Project[];
  onClose: () => void;
}

const getFirstSentence = (value: string) => {
  const sentence = value
    .split(".")
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  return sentence ? `${sentence}.` : "Profile summary is being updated.";
};

const PoliticianPanel = ({ politician, projects, onClose }: PoliticianPanelProps) => {
  const politicianProjects = (projects ?? []).filter((project) => project.politicianId === politician.id);
  const completedRate = politician.totalPromises > 0
    ? Math.round((politician.completedPromises / politician.totalPromises) * 100)
    : 0;
  const trustLabel =
    politician.accountabilityScore >= 85
      ? "High public confidence"
      : politician.accountabilityScore >= 70
        ? "Growing public confidence"
        : "Needs stronger delivery record";

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
            <div className="h-20 w-20 overflow-hidden rounded-none border border-border bg-primary/10">
              <img
                src={politician.photo?.trim() || "/generated/politician-portrait.webp"}
                alt={`${politician.name} profile`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = "/generated/politician-portrait.webp";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-foreground">{politician.name}</h3>
                {politician.verified && (
                  <span className="w-5 h-5 rounded-full bg-twitter-blue flex items-center justify-center">
                    <span className="text-[10px] text-white">✓</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{politician.party}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{politician.constituency}</span>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{trustLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Active Projects</p>
              <p className="mt-1 text-lg font-bold text-foreground">{politicianProjects.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Completion Rate</p>
              <p className="mt-1 text-lg font-bold text-civic-green">{completedRate}%</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Engagement</p>
              <p className="mt-1 text-lg font-bold text-foreground">{Math.min(politician.engagementPoints, 100)}%</p>
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

          {/* Background */}
          <div className="surface-line pt-5">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> About and Public Work
            </h4>
            <p className="text-sm font-medium text-foreground">{getFirstSentence(politician.manifesto)}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{politician.manifesto}</p>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Projects ({politicianProjects.length})
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">Includes current work updates and project-level activity linked to this representative.</p>
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
