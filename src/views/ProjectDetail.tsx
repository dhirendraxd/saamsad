"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import VerificationPanel from "@/components/VerificationPanel";
import EvidenceGallery from "@/components/EvidenceGallery";
import ActivityFeed from "@/components/ActivityFeed";
import { getStatusColor, getStatusLabel } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, Circle } from "lucide-react";
import type { ActivityItem } from "@/components/ActivityFeed";
import { useCommentsByProjectQuery, useProjectQuery } from "@/hooks/queries/useCivicQueries";
import { useNavigate, useParams } from "@/lib/router";
import { useAuth } from "@/lib/auth/useAuth";
import {
  addProjectComment,
  listLocalCommentsByProject,
  listVerificationsByProject,
  pushNotification,
  pushActivity,
  upsertVerification,
  type VerificationVote,
} from "@/lib/localParticipation";

const verificationLabelMap: Record<VerificationVote, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  delayed: "Delayed",
  "not-started": "Not Started",
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, role } = useAuth();
  const { data: project, isLoading: isProjectLoading } = useProjectQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading } = useCommentsByProjectQuery(id);
  const [localComments, setLocalComments] = useState(() => (id ? listLocalCommentsByProject(id) : []));
  const [localVerifications, setLocalVerifications] = useState(() => (id ? listVerificationsByProject(id) : []));
  const [commentDraft, setCommentDraft] = useState("");
  const [commentEvidence, setCommentEvidence] = useState<string[]>([]);
  const [verificationNote, setVerificationNote] = useState("");
  const [verificationEvidence, setVerificationEvidence] = useState<string[]>([]);

  useEffect(() => {
    if (!id) {
      return;
    }

    setLocalComments(listLocalCommentsByProject(id));
    setLocalVerifications(listVerificationsByProject(id));
  }, [id]);

  const mergedVotes = useMemo(() => {
    if (!project) {
      return {
        completed: 0,
        inProgress: 0,
        delayed: 0,
        notStarted: 0,
      };
    }

    const totals = {
      completed: project.verificationVotes.completed,
      inProgress: project.verificationVotes.inProgress,
      delayed: project.verificationVotes.delayed,
      notStarted: project.verificationVotes.notStarted,
    };

    for (const verification of localVerifications) {
      if (verification.vote === "completed") totals.completed += 1;
      if (verification.vote === "in-progress") totals.inProgress += 1;
      if (verification.vote === "delayed") totals.delayed += 1;
      if (verification.vote === "not-started") totals.notStarted += 1;
    }

    return totals;
  }, [localVerifications, project]);

  const combinedComments = useMemo(() => {
    return [...localComments, ...comments].sort((a, b) => b.date.localeCompare(a.date));
  }, [comments, localComments]);

  const currentUserVote = useMemo(() => {
    if (!session || !id) {
      return null;
    }

    return localVerifications.find((verification) => verification.projectId === id && verification.userId === session.userId) ?? null;
  }, [id, localVerifications, session]);

  const handleAddComment = () => {
    if (!session || !id || !commentDraft.trim()) {
      return;
    }

    const created = addProjectComment({
      projectId: id,
      author: session.name,
      authorId: session.userId,
      ward: session.ward,
      content: commentDraft,
      evidence: commentEvidence,
    });

    pushActivity({
      userId: session.userId,
      userRole: role === "politician" ? "politician" : "citizen",
      type: "comment",
      summary: `Commented on ${project?.title ?? "project"}`,
    });
    pushNotification({
      userId: session.userId,
      title: "Comment posted",
      message: `Your comment is now visible on ${project?.title ?? "this project"}.`,
    });

    setLocalComments((prev) => [created, ...prev]);
    setCommentDraft("");
    setCommentEvidence([]);
  };

  const handleSubmitVerification = (vote: VerificationVote) => {
    if (!session || !id) {
      return;
    }

    upsertVerification({
      projectId: id,
      userId: session.userId,
      userName: session.name,
      ward: session.ward,
      vote,
      note: verificationNote,
      evidence: verificationEvidence,
    });

    pushActivity({
      userId: session.userId,
      userRole: role === "politician" ? "politician" : "citizen",
      type: "verification",
      summary: `Marked ${project?.title ?? "project"} as ${verificationLabelMap[vote]}`,
    });
    pushNotification({
      userId: session.userId,
      title: "Verification submitted",
      message: `You marked ${project?.title ?? "this project"} as ${verificationLabelMap[vote]}.`,
    });

    setLocalVerifications(listVerificationsByProject(id));
    setVerificationEvidence([]);
    setVerificationNote("");
  };

  const handleFiles = (files: FileList | null, setter: (value: string[]) => void) => {
    if (!files) {
      setter([]);
      return;
    }

    const names = Array.from(files).map((file) => file.name);
    setter(names);
  };

  const activityItems: ActivityItem[] = useMemo(() => {
    if (!project) {
      return [];
    }

    const reviewSummary: ActivityItem = {
      type: "verification",
      author: "Community Review",
      content: `${mergedVotes.completed} marked completed, ${mergedVotes.inProgress} marked in progress, ${mergedVotes.delayed} marked delayed.`,
      date: project.updates[0]?.date ?? project.expectedCompletion,
    };

    return [
      reviewSummary,
      ...combinedComments.map((comment) => ({
        type: (comment.hasEvidence ? "evidence" : "comment") as ActivityItem["type"],
        author: comment.author,
        content: comment.content,
        date: comment.date,
      })),
    ].sort((a, b) => b.date.localeCompare(a.date));
  }, [combinedComments, mergedVotes.completed, mergedVotes.delayed, mergedVotes.inProgress, project]);

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
          <button onClick={() => navigate(-1)} className="mt-4 text-accent hover:text-twitter-blue hover:underline">Go back</button>
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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-twitter-blue mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{project.title}</h1>
            <span className={`rounded-none px-3 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}>
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
        <div className="surface-line mb-8 pt-6">
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
            <div className="surface-line pt-6">
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
              <div className="surface-line mb-4 pt-4 space-y-3">
                <textarea
                  className="field-line min-h-24"
                  placeholder={session ? "Share an update, question, or feedback..." : "Sign in to comment"}
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  disabled={!session}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-xs text-muted-foreground">
                    Attach evidence (photo/document names)
                    <input
                      type="file"
                      multiple
                      className="mt-1 block text-xs"
                      onChange={(event) => handleFiles(event.target.files, setCommentEvidence)}
                      disabled={!session}
                    />
                  </label>
                  <button
                    type="button"
                    className="rounded-none border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-twitter-blue hover:text-twitter-blue disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleAddComment}
                    disabled={!session || !commentDraft.trim()}
                  >
                    Post Comment
                  </button>
                </div>
                {commentEvidence.length > 0 && (
                  <p className="text-xs text-muted-foreground">Selected: {commentEvidence.join(", ")}</p>
                )}
              </div>
              {isCommentsLoading ? (
                <div className="surface-line pt-4 text-sm text-muted-foreground">Loading comments and reviews...</div>
              ) : activityItems.length === 0 ? (
                <div className="surface-line pt-4 text-sm text-muted-foreground">
                  No comments, photo uploads, or review activity yet.
                </div>
              ) : (
                <ActivityFeed items={activityItems} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <VerificationPanel votes={mergedVotes} />

            <div className="surface-line pt-6 space-y-3">
              <h3 className="font-bold text-foreground">Verify This Project</h3>
              <p className="text-xs text-muted-foreground">Submit your status check with optional note and evidence.</p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["completed", "in-progress", "delayed", "not-started"] as VerificationVote[]
                ).map((vote) => (
                  <button
                    key={vote}
                    type="button"
                    className={`rounded-none border px-2 py-2 text-xs font-semibold transition ${currentUserVote?.vote === vote ? "border-primary text-primary" : "border-border text-foreground hover:border-twitter-blue hover:text-twitter-blue"}`}
                    onClick={() => handleSubmitVerification(vote)}
                    disabled={!session}
                  >
                    {verificationLabelMap[vote]}
                  </button>
                ))}
              </div>
              <textarea
                className="field-line min-h-20"
                placeholder={session ? "Optional note about your verification" : "Sign in to verify projects"}
                value={verificationNote}
                onChange={(event) => setVerificationNote(event.target.value)}
                disabled={!session}
              />
              <label className="text-xs text-muted-foreground">
                Upload proof files
                <input
                  type="file"
                  multiple
                  className="mt-1 block text-xs"
                  onChange={(event) => handleFiles(event.target.files, setVerificationEvidence)}
                  disabled={!session}
                />
              </label>
              {currentUserVote && (
                <p className="text-xs text-muted-foreground">
                  Your latest vote: {verificationLabelMap[currentUserVote.vote]} ({new Date(currentUserVote.updatedAt).toLocaleDateString()})
                </p>
              )}
            </div>

            <div className="surface-line pt-6">
              <h3 className="font-bold text-foreground mb-3">Category</h3>
              <span className="inline-flex border-b border-accent/40 pb-1 text-sm font-medium text-accent">{project.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
