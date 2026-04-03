import apiClient from "@/lib/api";
import type {
  Employee,
  EmployeeFormValues,
  EmployeeListParams,
  EmployeesListResponse,
} from "../types/employee";

const EMPLOYEES_ENDPOINT = "/employees/employees/";

const normalizePayload = (data: EmployeeFormValues) => {
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

const toEmployeeFormData = (data: EmployeeFormValues) => {
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
    if (key === "work_days") {
      formData.append("work_days", JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  });

  return formData;
};

const shouldUseFormData = (data: EmployeeFormValues) => {
  const files = data.profile_picture;
  return files instanceof FileList && files.length > 0;
};

export const employeesService = {
  getEmployees: (params?: EmployeeListParams) =>
    apiClient.get<EmployeesListResponse>(EMPLOYEES_ENDPOINT, { params }),
  getEmployee: (id: number) =>
    apiClient.get<Employee>(`${EMPLOYEES_ENDPOINT}${id}/`),
  createEmployee: (data: EmployeeFormValues) =>
    apiClient.post<Employee>(
      EMPLOYEES_ENDPOINT,
      shouldUseFormData(data) ? toEmployeeFormData(data) : normalizePayload(data)
    ),
  updateEmployee: (id: number, data: EmployeeFormValues) =>
    apiClient.patch<Employee>(
      `${EMPLOYEES_ENDPOINT}${id}/`,
      shouldUseFormData(data) ? toEmployeeFormData(data) : normalizePayload(data)
    ),
  deleteEmployee: (id: number) =>
    apiClient.delete(`${EMPLOYEES_ENDPOINT}${id}/`),
  activateEmployee: (id: number) =>
    apiClient.post<{ message: string }>(`${EMPLOYEES_ENDPOINT}${id}/activate/`),
  deactivateEmployee: (id: number) =>
    apiClient.post<{ message: string }>(`${EMPLOYEES_ENDPOINT}${id}/deactivate/`),
};
