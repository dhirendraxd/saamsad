import { mockProjects } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";

const RecentProjects = () => {
  const recent = mockProjects.slice(0, 3);

  return (
    <section className="bg-card border-t">
      <div className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Recent Updates</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Projects in Motion
            </h2>
          </div>
          <a href="/explore" className="text-sm font-medium text-accent hover:underline hidden md:block">
            View all →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentProjects;
