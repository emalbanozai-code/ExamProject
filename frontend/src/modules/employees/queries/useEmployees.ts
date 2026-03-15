import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeesService } from "../services/employeesService";
import type { EmployeeFormValues, EmployeeListParams } from "../types/employee";

export const employeeKeys = {
  all: ["employees"] as const,
  list: (params?: EmployeeListParams) => [...employeeKeys.all, "list", params] as const,
  detail: (id: number) => [...employeeKeys.all, "detail", id] as const,
};

export const useEmployeesList = (params?: EmployeeListParams) =>
  useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeesService.getEmployees(params).then((res) => res.data),
  });

export const useEmployee = (id: number, enabled = true) =>
  useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeesService.getEmployee(id).then((res) => res.data),
    enabled: enabled && Number.isFinite(id) && id > 0,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormValues) =>
      employeesService.createEmployee(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
};

export const useUpdateEmployee = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormValues) =>
      employeesService.updateEmployee(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeesService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
};

export const useActivateEmployee = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => employeesService.activateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
};

export const useDeactivateEmployee = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => employeesService.deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
};
