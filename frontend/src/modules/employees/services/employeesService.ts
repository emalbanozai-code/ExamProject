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
  return payload;
};

export const employeesService = {
  getEmployees: (params?: EmployeeListParams) =>
    apiClient.get<EmployeesListResponse>(EMPLOYEES_ENDPOINT, { params }),
  getEmployee: (id: number) =>
    apiClient.get<Employee>(`${EMPLOYEES_ENDPOINT}${id}/`),
  createEmployee: (data: EmployeeFormValues) =>
    apiClient.post<Employee>(EMPLOYEES_ENDPOINT, normalizePayload(data)),
  updateEmployee: (id: number, data: EmployeeFormValues) =>
    apiClient.patch<Employee>(`${EMPLOYEES_ENDPOINT}${id}/`, normalizePayload(data)),
  deleteEmployee: (id: number) =>
    apiClient.delete(`${EMPLOYEES_ENDPOINT}${id}/`),
  activateEmployee: (id: number) =>
    apiClient.post<{ message: string }>(`${EMPLOYEES_ENDPOINT}${id}/activate/`),
  deactivateEmployee: (id: number) =>
    apiClient.post<{ message: string }>(`${EMPLOYEES_ENDPOINT}${id}/deactivate/`),
};
