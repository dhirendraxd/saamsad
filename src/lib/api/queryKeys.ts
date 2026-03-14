export const queryKeys = {
  auth: ["auth"] as const,
  session: () => ["auth", "session"] as const,
  politicians: () => ["politicians"] as const,
  politician: (id: string) => ["politicians", id] as const,
  projects: () => ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  comments: () => ["comments"] as const,
  commentsByProject: (projectId: string) => ["comments", "project", projectId] as const,
  regions: () => ["regions"] as const,
  educationTopics: () => ["education-topics"] as const,
};
