import { type KeyboardEvent, useEffect, useState } from "react";
import { MapPin, MessageSquare, Image } from "lucide-react";
import { getProjectCoverImage, getStatusColor, getStatusLabel } from "@/data/mockData";
import type { Project } from "@/lib/api/contracts";
import { useNavigate } from "@/lib/router";

interface ProjectCardProps {
  project: Project;
  disableNavigation?: boolean;
  onCardClick?: (project: Project) => void;
}

const ProjectCard = ({ project, disableNavigation = false, onCardClick }: ProjectCardProps) => {
  const navigate = useNavigate();
  const fallbackCoverSrc = "/generated/project-drainage.webp";
  const resolvedCoverSrc = getProjectCoverImage(project.id)?.trim() || fallbackCoverSrc;
  const [coverSrc, setCoverSrc] = useState(resolvedCoverSrc);

  useEffect(() => {
    setCoverSrc(resolvedCoverSrc);
  }, [resolvedCoverSrc]);

  const handleOpen = () => {
    if (onCardClick) {
      onCardClick(project);
      return;
    }

    if (disableNavigation) {
      return;
    }

    navigate(`/project/${project.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  const progressBarColor =
    project.status === "completed"
      ? "bg-civic-green"
      : project.status === "delayed"
        ? "bg-civic-amber"
        : "bg-primary";

  return (
    <div
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      role={disableNavigation || onCardClick ? "button" : "link"}
      tabIndex={0}
      className={`surface-line relative overflow-hidden border-x border-border/40 bg-transparent transition-colors focus:outline-none focus:ring-0 ${
        disableNavigation && !onCardClick
          ? "cursor-default"
          : "cursor-pointer hover:border-accent/40 focus:border-accent/40"
      }`}
    >
      <div className="relative h-64 w-full overflow-hidden border-b border-border/50 bg-neutral-100">
        <img
          src={coverSrc}
          alt={`${project.title} cover`}
          className="block h-full w-full object-cover object-center"
          loading="lazy"
          onError={() => setCoverSrc((current) => (current === fallbackCoverSrc ? current : fallbackCoverSrc))}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        <div className="pointer-events-none absolute right-3 top-3 border border-white/40 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white">
          {getStatusLabel(project.status)}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-xl font-extrabold leading-tight">{project.title}</h3>
            <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold">{project.progress}%</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-white/85">{project.description}</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-xs text-muted-foreground">{project.politicianName}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{project.location}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 border-b border-border pb-0.5 text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            {project.commentCount}
          </span>
          <span className="inline-flex items-center gap-1 border-b border-border pb-0.5 text-muted-foreground">
            <Image className="w-3 h-3" />
            {project.evidenceCount}
          </span>
          <span className={`inline-flex items-center border-b pb-0.5 text-[10px] font-semibold ${getStatusColor(project.status)}`}>
            {project.category}
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground">
            Due {new Date(project.expectedCompletion).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        </div>

        <div className="border-t border-border pt-2 text-sm font-semibold text-foreground">
          View project
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
