import { MapPin, MessageSquare, Image } from "lucide-react";
import { type Project, getStatusColor, getStatusLabel } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all cursor-pointer border border-transparent hover:border-accent/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{project.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{project.politicianName}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ${getStatusColor(project.status)}`}>
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
          <span className="font-semibold text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
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
