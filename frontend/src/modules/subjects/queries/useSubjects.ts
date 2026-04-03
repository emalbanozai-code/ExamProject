import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectsService } from "../services/subjectsService";
import type { SubjectFormValues, SubjectListParams } from "../types/subject";

export const subjectKeys = {
  all: ["subjects"] as const,
  list: (params?: SubjectListParams) => [...subjectKeys.all, "list", params] as const,
  detail: (id: number) => [...subjectKeys.all, "detail", id] as const,
  instructors: () => [...subjectKeys.all, "instructors"] as const,
};

export const useSubjectsList = (params?: SubjectListParams) =>
  useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => subjectsService.getSubjects(params).then((res) => res.data),
  });

export const useSubject = (id: number, enabled = true) =>
  useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectsService.getSubject(id).then((res) => res.data),
    enabled: enabled && Number.isFinite(id) && id > 0,
  });

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectFormValues) =>
      subjectsService.createSubject(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

export const useUpdateSubject = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectFormValues) =>
      subjectsService.updateSubject(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subjectsService.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

export const useActivateSubject = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subjectsService.activateSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
    },
  });
};

export const useDeactivateSubject = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subjectsService.deactivateSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
    },
  });
};

export const useInstructorOptions = () =>
  useQuery({
    queryKey: subjectKeys.instructors(),
    queryFn: () => subjectsService.getInstructorOptions(),
  });
