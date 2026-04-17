"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import ScoreDashboard from "@/components/ScoreDashboard";
import { ArrowLeft, MapPin } from "lucide-react";
import { usePoliticianQuery, useProjectsQuery } from "@/hooks/queries/useCivicQueries";
import { listPoliticianPublicImages } from "@/lib/localParticipation";
import { useNavigate, useParams } from "@/lib/router";

const PoliticianDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: politician, isLoading: isPoliticianLoading } = usePoliticianQuery(id);
  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();
  const [publicImages, setPublicImages] = useState<ReturnType<typeof listPoliticianPublicImages>>([]);

  useEffect(() => {
    if (!id) {
      setPublicImages([]);
      return;
    }

    setPublicImages(listPoliticianPublicImages(id));
  }, [id]);

  if (isPoliticianLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!politician) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Politician not found</h1>
          <button onClick={() => navigate(-1)} className="mt-4 text-accent hover:text-twitter-blue hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const photoSrc = politician.photo?.trim() || `https://i.pravatar.cc/640?u=${encodeURIComponent(politician.id)}`;
  const politicianProjects = projects.filter((project) => project.politicianId === politician.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-twitter-blue transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <section className="surface-line grid gap-6 border-t-2 border-primary/40 pt-6 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden border border-border/60">
            <img src={photoSrc} alt={`${politician.name} profile`} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground">{politician.name}</h1>
              {politician.verified && <span className="text-xs font-semibold text-twitter-blue">Verified</span>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{politician.party}</p>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {politician.constituency}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{politician.manifesto}</p>
          </div>
        </section>

        <section className="surface-line border-t-2 border-civic-green/50 pt-6">
          <h2 className="mb-4 text-base font-bold text-civic-green">Public Score Snapshot</h2>
          <ScoreDashboard
            accountability={politician.accountabilityScore}
            transparency={politician.transparencyScore}
            communityTrust={politician.communityTrust}
            engagement={Math.min(politician.engagementPoints, 100)}
            completedPromises={politician.completedPromises}
            totalPromises={politician.totalPromises}
          />
          {publicImages.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-semibold text-twitter-blue">Public Interaction Photos</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {publicImages.slice(0, 9).map((item) => (
                  <div key={item.id} className="surface-line pt-2">
                    <img src={item.imageDataUrl} alt={item.caption || `${politician.name} public interaction`} className="h-32 w-full object-cover" loading="lazy" />
                    <p className="mt-2 text-xs text-muted-foreground">{item.caption?.trim() || "Public interaction"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-base font-bold text-accent">Projects by {politician.name}</h2>
          {isProjectsLoading ? (
            <div className="surface-line py-6 text-sm text-muted-foreground">Loading projects...</div>
          ) : politicianProjects.length === 0 ? (
            <div className="surface-line py-6 text-sm text-muted-foreground">No projects available yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {politicianProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PoliticianDetail;
