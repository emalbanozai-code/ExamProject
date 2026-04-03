import apiClient from "@/lib/api";
import type {
  Student,
  StudentFormValues,
  StudentListParams,
  StudentsListResponse,
} from "../types/student";

const STUDENTS_ENDPOINT = "/students/students/";

const normalizePayload = (data: StudentFormValues) => {
  const payload: Record<string, unknown> = { ...data };
  if (!payload.password) {
    delete payload.password;
  }
  if (!payload.father_name) {
    delete payload.father_name;
  }
  if (!payload.address) {
    delete payload.address;
  }
  if (!payload.phone_number) {
    delete payload.phone_number;
  }
  if (!payload.date_of_birth) {
    payload.date_of_birth = null;
  }
  if (!payload.profile_picture) {
    delete payload.profile_picture;
  } else if (
    payload.profile_picture instanceof FileList &&
    payload.profile_picture.length === 0
  ) {
    delete payload.profile_picture;
  }
  return payload;
};

const toStudentFormData = (data: StudentFormValues) => {
  const formData = new FormData();
  const payload = normalizePayload(data);

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "profile_picture") {
      const files = value as FileList;
      if (files && files.length > 0) {
        formData.append("profile_picture", files[0]);
      }
      return;
    }
    formData.append(key, String(value));
  });

  return formData;
};

const shouldUseFormData = (data: StudentFormValues) => {
  const files = data.profile_picture;
  return files instanceof FileList && files.length > 0;
};
export const studentsService = {
  getStudents: (params?: StudentListParams) =>
    apiClient.get<StudentsListResponse>(STUDENTS_ENDPOINT, { params }),
  getStudent: (id: number) =>
    apiClient.get<Student>(`${STUDENTS_ENDPOINT}${id}/`),
  createStudent: (data: StudentFormValues) =>
    apiClient.post<Student>(
      STUDENTS_ENDPOINT,
      shouldUseFormData(data) ? toStudentFormData(data) : normalizePayload(data)
    ),
  updateStudent: (id: number, data: StudentFormValues) =>
    apiClient.patch<Student>(
      `${STUDENTS_ENDPOINT}${id}/`,
      shouldUseFormData(data) ? toStudentFormData(data) : normalizePayload(data)
    ),
  deleteStudent: (id: number) =>
    apiClient.delete(`${STUDENTS_ENDPOINT}${id}/`),
  activateStudent: (id: number) =>
    apiClient.post<{ message: string }>(`${STUDENTS_ENDPOINT}${id}/activate/`),
  deactivateStudent: (id: number) =>
    apiClient.post<{ message: string }>(`${STUDENTS_ENDPOINT}${id}/deactivate/`),
};
