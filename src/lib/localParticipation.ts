"use client";

export type VerificationVote = "completed" | "in-progress" | "delayed" | "not-started";

export interface IssueResponse {
  id: string;
  responderId: string;
  responderName: string;
  message: string;
  linkedProjectId?: string;
  createdAt: string;
}

export interface IssueReport {
  id: string;
  title: string;
  description: string;
  ward: string;
  municipality: string;
  location: string;
  category: string;
  status: "reported" | "acknowledged" | "resolved";
  authorId: string;
  authorName: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
  responses: IssueResponse[];
}

export interface ProjectVerification {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  ward: string;
  vote: VerificationVote;
  note?: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalProjectComment {
  id: string;
  projectId: string;
  author: string;
  authorId: string;
  ward: string;
  content: string;
  hasEvidence: boolean;
  evidence: string[];
  date: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userRole: "citizen" | "politician";
  type: "issue" | "verification" | "comment" | "response" | "project";
  summary: string;
  createdAt: string;
}

interface ParticipationStore {
  issues: IssueReport[];
  verifications: ProjectVerification[];
  comments: LocalProjectComment[];
  activity: ActivityEvent[];
}

const STORAGE_KEY = "civic-participation-v1";

const EMPTY_STORE: ParticipationStore = {
  issues: [],
  verifications: [],
  comments: [],
  activity: [],
};

function hasWindow() {
  return typeof window !== "undefined";
}

function safeParse(raw: string | null): ParticipationStore {
  if (!raw) {
    return EMPTY_STORE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ParticipationStore>;
    return {
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      verifications: Array.isArray(parsed.verifications) ? parsed.verifications : [],
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch {
    return EMPTY_STORE;
  }
}

function readStore(): ParticipationStore {
  if (!hasWindow()) {
    return EMPTY_STORE;
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeStore(next: ParticipationStore): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function eventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function listIssuesByWard(ward: string): IssueReport[] {
  return readStore().issues
    .filter((issue) => issue.ward === ward)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listIssuesByAuthor(userId: string): IssueReport[] {
  return readStore().issues
    .filter((issue) => issue.authorId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createIssue(input: {
  title: string;
  description: string;
  ward: string;
  municipality: string;
  location: string;
  category: string;
  authorId: string;
  authorName: string;
  evidence?: string[];
}): IssueReport {
  const store = readStore();
  const now = new Date().toISOString();

  const issue: IssueReport = {
    id: eventId("issue"),
    title: input.title.trim(),
    description: input.description.trim(),
    ward: input.ward,
    municipality: input.municipality,
    location: input.location.trim(),
    category: input.category.trim() || "General",
    status: "reported",
    authorId: input.authorId,
    authorName: input.authorName,
    evidence: input.evidence ?? [],
    createdAt: now,
    updatedAt: now,
    responses: [],
  };

  writeStore({ ...store, issues: [issue, ...store.issues] });
  return issue;
}

export function respondToIssue(input: {
  issueId: string;
  responderId: string;
  responderName: string;
  message: string;
  linkedProjectId?: string;
}): IssueReport | null {
  const store = readStore();
  const issue = store.issues.find((entry) => entry.id === input.issueId);

  if (!issue) {
    return null;
  }

  const response: IssueResponse = {
    id: eventId("resp"),
    responderId: input.responderId,
    responderName: input.responderName,
    message: input.message.trim(),
    linkedProjectId: input.linkedProjectId,
    createdAt: new Date().toISOString(),
  };

  const nextIssues = store.issues.map((entry) =>
    entry.id === input.issueId
      ? {
          ...entry,
          status: "acknowledged" as const,
          updatedAt: response.createdAt,
          responses: [response, ...entry.responses],
        }
      : entry,
  );

  writeStore({ ...store, issues: nextIssues });
  return nextIssues.find((entry) => entry.id === input.issueId) ?? null;
}

export function listVerificationsByProject(projectId: string): ProjectVerification[] {
  return readStore().verifications.filter((verification) => verification.projectId === projectId);
}

export function upsertVerification(input: {
  projectId: string;
  userId: string;
  userName: string;
  ward: string;
  vote: VerificationVote;
  note?: string;
  evidence?: string[];
}): ProjectVerification {
  const store = readStore();
  const now = new Date().toISOString();

  const existing = store.verifications.find(
    (verification) => verification.projectId === input.projectId && verification.userId === input.userId,
  );

  if (existing) {
    const updated: ProjectVerification = {
      ...existing,
      vote: input.vote,
      note: input.note?.trim(),
      evidence: input.evidence ?? existing.evidence,
      updatedAt: now,
    };

    const next = store.verifications.map((verification) =>
      verification.id === existing.id ? updated : verification,
    );

    writeStore({ ...store, verifications: next });
    return updated;
  }

  const created: ProjectVerification = {
    id: eventId("ver"),
    projectId: input.projectId,
    userId: input.userId,
    userName: input.userName,
    ward: input.ward,
    vote: input.vote,
    note: input.note?.trim(),
    evidence: input.evidence ?? [],
    createdAt: now,
    updatedAt: now,
  };

  writeStore({ ...store, verifications: [created, ...store.verifications] });
  return created;
}

export function listLocalCommentsByProject(projectId: string): LocalProjectComment[] {
  return readStore().comments
    .filter((comment) => comment.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function addProjectComment(input: {
  projectId: string;
  author: string;
  authorId: string;
  ward: string;
  content: string;
  evidence?: string[];
}): LocalProjectComment {
  const store = readStore();
  const evidence = input.evidence ?? [];

  const comment: LocalProjectComment = {
    id: eventId("comment"),
    projectId: input.projectId,
    author: input.author,
    authorId: input.authorId,
    ward: input.ward,
    content: input.content.trim(),
    hasEvidence: evidence.length > 0,
    evidence,
    date: new Date().toISOString(),
  };

  writeStore({ ...store, comments: [comment, ...store.comments] });
  return comment;
}

export function pushActivity(input: Omit<ActivityEvent, "id" | "createdAt">): ActivityEvent {
  const store = readStore();
  const event: ActivityEvent = {
    id: eventId("act"),
    createdAt: new Date().toISOString(),
    ...input,
  };

  writeStore({ ...store, activity: [event, ...store.activity].slice(0, 400) });
  return event;
}

export function listActivityByUser(userId: string): ActivityEvent[] {
  return readStore().activity
    .filter((event) => event.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
