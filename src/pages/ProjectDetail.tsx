import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationPanel from "@/components/VerificationPanel";
import EvidenceGallery from "@/components/EvidenceGallery";
import ActivityFeed from "@/components/ActivityFeed";
import { getStatusColor, getStatusLabel } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, Circle } from "lucide-react";
import type { ActivityItem } from "@/components/ActivityFeed";
import { useCommentsByProjectQuery, useProjectQuery } from "@/hooks/queries/useCivicQueries";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading: isProjectLoading } = useProjectQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading } = useCommentsByProjectQuery(id);
  const activityItems: ActivityItem[] = useMemo(() => {
    if (!project) {
      return [];
    }

    const reviewSummary: ActivityItem = {
      type: "verification",
      author: "Community Review",
      content: `${project.verificationVotes.completed} marked completed, ${project.verificationVotes.inProgress} marked in progress, ${project.verificationVotes.delayed} marked delayed.`,
      date: project.updates[0]?.date ?? project.expectedCompletion,
    };

    return [
      reviewSummary,
      ...comments.map((comment) => ({
        type: (comment.hasEvidence ? "evidence" : "comment") as ActivityItem["type"],
        author: comment.author,
        content: comment.content,
        date: comment.date,
      })),
    ].sort((a, b) => b.date.localeCompare(a.date));
  }, [comments, project]);

  if (isProjectLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          <button onClick={() => navigate(-1)} className="mt-4 text-accent hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const evidenceItems = [
    { type: "photo" as const, title: "Construction progress shot", uploadedBy: "Sarah K.", date: "2026-03-10" },
    { type: "photo" as const, title: "Foundation work close-up", uploadedBy: "Michael O.", date: "2026-02-28" },
    { type: "document" as const, title: "Official progress report Q1", uploadedBy: project.politicianName, date: "2026-01-15" },
    { type: "photo" as const, title: "Site overview from road", uploadedBy: "Esther N.", date: "2026-03-05" },
    { type: "document" as const, title: "Budget allocation document", uploadedBy: project.politicianName, date: "2025-12-01" },
    { type: "photo" as const, title: "Workers on site", uploadedBy: "John D.", date: "2026-02-15" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{project.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl">{project.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{project.location}</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{project.politicianName}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
              {new Date(project.startDate).toLocaleDateString()} — {new Date(project.expectedCompletion).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-foreground">Overall Progress</span>
            <span className="font-extrabold text-accent">{project.progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-foreground mb-5">Project Timeline</h3>
              <div className="space-y-4">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {m.completed ? (
                        <CheckCircle className="w-5 h-5 text-civic-green flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      {i < project.milestones.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${m.completed ? "text-foreground" : "text-muted-foreground"}`}>{m.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EvidenceGallery items={evidenceItems} />

            {/* Comments and reviews */}
            <div>
              <h3 className="font-bold text-foreground mb-4">Comments and Reviews</h3>
              {isCommentsLoading ? (
                <div className="bg-card rounded-xl border p-4 text-sm text-muted-foreground">Loading comments and reviews...</div>
              ) : activityItems.length === 0 ? (
                <div className="bg-card rounded-xl border p-4 text-sm text-muted-foreground">
                  No comments, photo uploads, or review activity yet.
                </div>
              ) : (
                <ActivityFeed items={activityItems} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <VerificationPanel votes={project.verificationVotes} />

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-foreground mb-3">Category</h3>
              <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">{project.category}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
