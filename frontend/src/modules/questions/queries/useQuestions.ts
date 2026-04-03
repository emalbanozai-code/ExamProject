import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionsService } from "../services/questionsService";
import type { QuestionFormValues, QuestionListParams } from "../types/question";

export const questionKeys = {
  all: ["questions"] as const,
  list: (params?: QuestionListParams) => [...questionKeys.all, "list", params] as const,
  detail: (id: number) => [...questionKeys.all, "detail", id] as const,
  subjects: () => [...questionKeys.all, "subjects"] as const,
  employees: () => [...questionKeys.all, "employees"] as const,
};

export const useQuestionsList = (params?: QuestionListParams) =>
  useQuery({
    queryKey: questionKeys.list(params),
    queryFn: () => questionsService.getQuestions(params).then((res) => res.data),
  });

export const useQuestion = (id: number, enabled = true) =>
  useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionsService.getQuestion(id).then((res) => res.data),
    enabled: enabled && Number.isFinite(id) && id > 0,
  });

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionFormValues) =>
      questionsService.createQuestion(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
};

export const useUpdateQuestion = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionFormValues) =>
      questionsService.updateQuestion(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => questionsService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
};

export const useSubjectOptions = () =>
  useQuery({
    queryKey: questionKeys.subjects(),
    queryFn: () => questionsService.getSubjectOptions(),
  });

export const useEmployeeOptions = () =>
  useQuery({
    queryKey: questionKeys.employees(),
    queryFn: () => questionsService.getEmployeeOptions(),
  });
