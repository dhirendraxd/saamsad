import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Project } from "@/lib/api/contracts";
import { useProjectsQuery } from "@/hooks/queries/useCivicQueries";

function getMostRecentActivityTimestamp(project: Project) {
  const mostRecentUpdate = project.updates.reduce<number>((latest, update) => {
    const timestamp = Date.parse(update.date);
    return Number.isNaN(timestamp) ? latest : Math.max(latest, timestamp);
  }, 0);

  const fallbackTimestamp = Date.parse(project.startDate);
  return mostRecentUpdate || (Number.isNaN(fallbackTimestamp) ? 0 : fallbackTimestamp);
}

const RecentProjects = () => {
  const { data: projects = [], isLoading } = useProjectsQuery();
  const recent = useMemo(
    () => [...projects].sort((left, right) => getMostRecentActivityTimestamp(right) - getMostRecentActivityTimestamp(left)).slice(0, 3),
    [projects],
  );

  return (
    <section className="bg-background border-t border-border">
      <div className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-civic-slate font-semibold text-sm uppercase tracking-wider mb-2">Recent Updates</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Projects in Motion
            </h2>
          </div>
          <Link
            to="/explore"
            className="hidden text-sm font-medium text-foreground transition-colors hover:text-twitter-blue md:block"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="surface-line py-6 text-sm text-muted-foreground">
            Loading recent projects...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((project) => (
              <article key={project.id} className="surface-line pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-civic-slate">{project.ward}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{project.title}</h3>
                <div className="my-3 h-px w-full bg-border" />
                <p className="line-clamp-2 text-sm text-civic-slate">{project.description}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-civic-slate">
                    <span>Status</span>
                    <span className="text-foreground">{project.status.replace("-", " ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-civic-slate">Progress</p>
                    <p className="text-2xl font-extrabold text-civic-amber">{project.progress}%</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentProjects;
