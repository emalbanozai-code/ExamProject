import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentsService } from "../services/studentsService";
import type { StudentFormValues, StudentListParams } from "../types/student";

export const studentKeys = {
  all: ["students"] as const,
  list: (params?: StudentListParams) => [...studentKeys.all, "list", params] as const,
  detail: (id: number) => [...studentKeys.all, "detail", id] as const,
};

export const useStudentsList = (params?: StudentListParams) =>
  useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentsService.getStudents(params).then((res) => res.data),
  });

export const useStudent = (id: number, enabled = true) =>
  useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsService.getStudent(id).then((res) => res.data),
    enabled: enabled && Number.isFinite(id) && id > 0,
  });

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentFormValues) =>
      studentsService.createStudent(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
};

export const useUpdateStudent = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentFormValues) =>
      studentsService.updateStudent(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentsService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
};

export const useActivateStudent = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentsService.activateStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
};

export const useDeactivateStudent = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentsService.deactivateStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
};
