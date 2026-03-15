import { useMemo } from "react";
import { useEmployeesStore } from "../stores/useEmployeesStore";
import type { EmployeeListParams } from "../types/employee";

export const useEmployeeFilters = () => {
  const { search, role, status, page, page_size, setSearch, setRole, setStatus, setPage, reset } =
    useEmployeesStore();

  const params = useMemo<EmployeeListParams>(
    () => ({
      search: search || undefined,
      role: role || undefined,
      status: status || undefined,
      page,
      page_size,
    }),
    [search, role, status, page, page_size]
  );

  return {
    search,
    role,
    status,
    page,
    page_size,
    setSearch,
    setRole,
    setStatus,
    setPage,
    reset,
    params,
  };
};
