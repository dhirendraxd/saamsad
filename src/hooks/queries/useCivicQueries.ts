import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IdentityRegistrationInput } from "@/lib/api/contracts";
import { civicApi } from "@/lib/api/civicApi";
import { queryKeys } from "@/lib/api/queryKeys";
import * as authService from "@/lib/auth/authService";

const FIVE_MINUTES = 1000 * 60 * 5;

export function usePoliticiansQuery() {
  return useQuery({
    queryKey: queryKeys.politicians(),
    queryFn: civicApi.fetchPoliticians,
    staleTime: FIVE_MINUTES,
  });
}

export function usePoliticianQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.politician(id ?? ""),
    queryFn: () => civicApi.fetchPoliticianById(id ?? ""),
    enabled: Boolean(id),
    staleTime: FIVE_MINUTES,
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: civicApi.fetchProjects,
    staleTime: FIVE_MINUTES,
  });
}

export function useProjectQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.project(id ?? ""),
    queryFn: () => civicApi.fetchProjectById(id ?? ""),
    enabled: Boolean(id),
    staleTime: FIVE_MINUTES,
  });
}

export function useCommentsByProjectQuery(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.commentsByProject(projectId ?? ""),
    queryFn: () => civicApi.fetchCommentsByProjectId(projectId ?? ""),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60,
  });
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: queryKeys.regions(),
    queryFn: civicApi.fetchRegions,
    staleTime: 1000 * 60 * 30,
  });
}

export function useEducationTopicsQuery() {
  return useQuery({
    queryKey: queryKeys.educationTopics(),
    queryFn: civicApi.fetchEducationTopics,
    staleTime: 1000 * 60 * 15,
  });
}

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: async () => authService.getSession(),
    staleTime: Infinity,
  });
}

export function useRegisterIdentityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IdentityRegistrationInput) => authService.registerIdentity(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.session(), session);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session(), null);
    },
  });
}
