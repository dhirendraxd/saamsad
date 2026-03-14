import {
  commentsSchema,
  educationTopicsSchema,
  politicianSchema,
  politiciansSchema,
  projectSchema,
  projectsSchema,
  regionTreeSchema,
  type Comment,
  type EducationTopic,
  type Politician,
  type Project,
  type RegionTree,
} from "@/lib/api/contracts";
import {
  mockComments,
  mockEducationTopics,
  mockPoliticians,
  mockProjects,
  mockRegions,
} from "@/data/mockData";

const NETWORK_LATENCY_MS = 120;

function wait(ms = NETWORK_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPoliticians(): Promise<Politician[]> {
  await wait();
  return politiciansSchema.parse(mockPoliticians);
}

export async function fetchPoliticianById(id: string): Promise<Politician | null> {
  await wait();
  const item = mockPoliticians.find((politician) => politician.id === id);
  return item ? politicianSchema.parse(item) : null;
}

export async function fetchProjects(): Promise<Project[]> {
  await wait();
  return projectsSchema.parse(mockProjects);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  await wait();
  const item = mockProjects.find((project) => project.id === id);
  return item ? projectSchema.parse(item) : null;
}

export async function fetchCommentsByProjectId(projectId: string): Promise<Comment[]> {
  await wait();
  if (!projectId) {
    return [];
  }

  return commentsSchema.parse(mockComments.filter((comment) => comment.projectId === projectId));
}

export async function fetchRegions(): Promise<RegionTree> {
  await wait();
  return regionTreeSchema.parse(mockRegions);
}

export async function fetchEducationTopics(): Promise<EducationTopic[]> {
  await wait();
  return educationTopicsSchema.parse(mockEducationTopics);
}
