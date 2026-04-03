import apiClient from "@/lib/api";
import type {
  InstructorOption,
  Subject,
  SubjectFormValues,
  SubjectListParams,
  SubjectsListResponse,
} from "../types/subject";

const SUBJECTS_ENDPOINT = "/subjects/subjects/";

const normalizePayload = (data: SubjectFormValues) => {
  const payload: Record<string, unknown> = { ...data };
  if (!payload.description) {
    delete payload.description;
  }
  return payload;
};

export const subjectsService = {
  getSubjects: (params?: SubjectListParams) =>
    apiClient.get<SubjectsListResponse>(SUBJECTS_ENDPOINT, { params }),
  getSubject: (id: number) =>
    apiClient.get<Subject>(`${SUBJECTS_ENDPOINT}${id}/`),
  createSubject: (data: SubjectFormValues) =>
    apiClient.post<Subject>(SUBJECTS_ENDPOINT, normalizePayload(data)),
  updateSubject: (id: number, data: SubjectFormValues) =>
    apiClient.patch<Subject>(`${SUBJECTS_ENDPOINT}${id}/`, normalizePayload(data)),
  deleteSubject: (id: number) => apiClient.delete(`${SUBJECTS_ENDPOINT}${id}/`),
  activateSubject: (id: number) =>
    apiClient.post<{ message: string }>(`${SUBJECTS_ENDPOINT}${id}/activate/`),
  deactivateSubject: (id: number) =>
    apiClient.post<{ message: string }>(`${SUBJECTS_ENDPOINT}${id}/deactivate/`),
  getInstructorOptions: async () => {
    const response = await apiClient.get<SubjectsListResponse>(
      "/employees/employees/",
      { params: { role: "instructor", page_size: 500 } }
    );

    const data = response.data;
    const items = Array.isArray(data) ? data : data.results;

    return items.map((item: any) => ({
      value: item.id,
      label: `${item.first_name} ${item.last_name}`.trim() || item.username,
    })) as InstructorOption[];
  },
};
