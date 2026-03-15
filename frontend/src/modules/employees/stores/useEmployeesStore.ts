import { create } from "zustand";

import type { EmployeeRole, EmployeeStatus } from "../types/employee";

interface EmployeesFiltersState {
  search: string;
  role: EmployeeRole | "";
  status: EmployeeStatus | "";
  page: number;
  page_size: number;
  setSearch: (search: string) => void;
  setRole: (role: EmployeeRole | "") => void;
  setStatus: (status: EmployeeStatus | "") => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  role: "" as EmployeeRole | "",
  status: "" as EmployeeStatus | "",
  page: 1,
  page_size: 10,
};

export const useEmployeesStore = create<EmployeesFiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setRole: (role) => set({ role, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ ...initialState }),
}));
