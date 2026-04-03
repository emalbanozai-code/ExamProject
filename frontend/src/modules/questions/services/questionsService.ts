import apiClient from "@/lib/api";
import type {
  EmployeeOption,
  Question,
  QuestionFormValues,
  QuestionListParams,
  SubjectOption,
} from "../types/question";

const QUESTIONS_ENDPOINT = "/questions/questions/";

export const questionsService = {
  getQuestions: (params?: QuestionListParams) =>
    apiClient.get<QuestionsListResponse>(QUESTIONS_ENDPOINT, { params }),
  getQuestion: (id: number) => apiClient.get<Question>(`${QUESTIONS_ENDPOINT}${id}/`),
  createQuestion: (data: QuestionFormValues) =>
    apiClient.post<Question>(QUESTIONS_ENDPOINT, data),
  updateQuestion: (id: number, data: QuestionFormValues) =>
    apiClient.patch<Question>(`${QUESTIONS_ENDPOINT}${id}/`, data),
  deleteQuestion: (id: number) => apiClient.delete(`${QUESTIONS_ENDPOINT}${id}/`),
  getSubjectOptions: async () => {
    const response = await apiClient.get<any>("/subjects/subjects/", {
      params: { page_size: 500 },
    });

    const data = response.data;
    const items = Array.isArray(data) ? data : data?.results ?? [];

    return items.map((item: any) => ({
      value: item.id,
      label: item.subject_code ? `${item.subject_name} (${item.subject_code})` : item.subject_name,
    })) as SubjectOption[];
  },
  getEmployeeOptions: async () => {
    const response = await apiClient.get<any>("/employees/employees/", {
      params: { page_size: 500 },
    });

    const data = response.data;
    const items = Array.isArray(data) ? data : data?.results ?? [];

    return items.map((item: any) => ({
      value: item.id,
      label: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || item.username,
    })) as EmployeeOption[];
  },
};
