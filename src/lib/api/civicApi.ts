import type {
  Comment,
  EducationTopic,
  Politician,
  Project,
  RegionTree,
} from "@/lib/api/contracts";
import * as mockApi from "@/lib/api/mockApi";

export interface CivicApiClient {
  fetchPoliticians: () => Promise<Politician[]>;
  fetchPoliticianById: (id: string) => Promise<Politician | null>;
  fetchProjects: () => Promise<Project[]>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  fetchCommentsByProjectId: (projectId: string) => Promise<Comment[]>;
  fetchRegions: () => Promise<RegionTree>;
  fetchEducationTopics: () => Promise<EducationTopic[]>;
}

// Frontend-first mode: the UI currently runs entirely on local mock data.
// Backend can be integrated later by swapping this implementation with a real API adapter.
const frontendMockClient: CivicApiClient = {
  fetchPoliticians: mockApi.fetchPoliticians,
  fetchPoliticianById: mockApi.fetchPoliticianById,
  fetchProjects: mockApi.fetchProjects,
  fetchProjectById: mockApi.fetchProjectById,
  fetchCommentsByProjectId: mockApi.fetchCommentsByProjectId,
  fetchRegions: mockApi.fetchRegions,
  fetchEducationTopics: mockApi.fetchEducationTopics,
};

export const civicApi: CivicApiClient = frontendMockClient;
