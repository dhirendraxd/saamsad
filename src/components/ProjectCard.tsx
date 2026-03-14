import { type KeyboardEvent } from "react";
import { MapPin, MessageSquare, Image } from "lucide-react";
import { type Project, getStatusColor, getStatusLabel } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleOpen = () => {
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
      role="link"
      tabIndex={0}
      className="surface-line cursor-pointer pt-5 transition-colors hover:border-twitter-blue/50 hover:text-twitter-blue focus:outline-none focus:ring-0 focus:border-twitter-blue/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{project.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{project.politicianName}</p>
        </div>
        <span className={`flex-shrink-0 rounded-none px-2.5 py-1 text-[10px] font-semibold ${getStatusColor(project.status)}`}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{project.location}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-civic-green">{project.progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {project.commentCount}
        </span>
        <span className="flex items-center gap-1">
          <Image className="w-3 h-3" />
          {project.evidenceCount}
        </span>
        <span className="ml-auto text-[10px]">
          Due: {new Date(project.expectedCompletion).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
