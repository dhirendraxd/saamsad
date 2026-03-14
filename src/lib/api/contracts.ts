import { z } from "zod";

export const userRoleSchema = z.enum(["citizen", "politician"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const identityRegistrationInputSchema = z.object({
  nationalId: z.string().min(4),
  name: z.string().min(2),
  ward: z.string().min(1),
  municipality: z.string().min(1),
});
export type IdentityRegistrationInput = z.infer<typeof identityRegistrationInputSchema>;

export const authSessionSchema = z.object({
  userId: z.string(),
  token: z.string(),
  role: userRoleSchema,
  name: z.string(),
  ward: z.string(),
  municipality: z.string(),
  verified: z.boolean(),
  createdAt: z.string(),
});
export type AuthSession = z.infer<typeof authSessionSchema>;

export const projectStatusSchema = z.enum(["completed", "in-progress", "delayed", "not-started"]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const politicianSchema = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string(),
  party: z.string(),
  constituency: z.string(),
  ward: z.string(),
  province: z.string(),
  district: z.string(),
  municipality: z.string(),
  accountabilityScore: z.number(),
  transparencyScore: z.number(),
  communityTrust: z.number(),
  engagementPoints: z.number(),
  totalPromises: z.number(),
  completedPromises: z.number(),
  delayedPromises: z.number(),
  failedPromises: z.number(),
  activeProjects: z.number(),
  badges: z.array(z.string()),
  manifesto: z.string(),
  verified: z.boolean(),
});
export type Politician = z.infer<typeof politicianSchema>;

export const projectMilestoneSchema = z.object({
  title: z.string(),
  date: z.string(),
  completed: z.boolean(),
});

export const projectUpdateSchema = z.object({
  date: z.string(),
  content: z.string(),
  type: z.enum(["progress", "milestone", "completion", "announcement"]),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  ward: z.string(),
  politicianId: z.string(),
  politicianName: z.string(),
  startDate: z.string(),
  expectedCompletion: z.string(),
  status: projectStatusSchema,
  progress: z.number(),
  category: z.string(),
  evidenceCount: z.number(),
  commentCount: z.number(),
  verificationVotes: z.object({
    completed: z.number(),
    inProgress: z.number(),
    delayed: z.number(),
    notStarted: z.number(),
  }),
  milestones: z.array(projectMilestoneSchema),
  updates: z.array(projectUpdateSchema),
});
export type Project = z.infer<typeof projectSchema>;

export const commentSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  author: z.string(),
  ward: z.string(),
  date: z.string(),
  content: z.string(),
  hasEvidence: z.boolean(),
});
export type Comment = z.infer<typeof commentSchema>;

export const educationTopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  readTime: z.string(),
  icon: z.string(),
});
export type EducationTopic = z.infer<typeof educationTopicSchema>;

const municipalitySchema = z.object({
  name: z.string(),
  wards: z.array(z.string()),
});

const districtSchema = z.object({
  name: z.string(),
  municipalities: z.array(municipalitySchema),
});

const provinceSchema = z.object({
  name: z.string(),
  districts: z.array(districtSchema),
});

export const regionTreeSchema = z.object({
  provinces: z.array(provinceSchema),
});
export type RegionTree = z.infer<typeof regionTreeSchema>;

export const politiciansSchema = z.array(politicianSchema);
export const projectsSchema = z.array(projectSchema);
export const commentsSchema = z.array(commentSchema);
export const educationTopicsSchema = z.array(educationTopicSchema);
