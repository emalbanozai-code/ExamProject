import { create } from "zustand";

import type { SubjectStatus } from "../types/subject";

interface SubjectsFiltersState {
  search: string;
  status: SubjectStatus | "";
  instructor: number | "";
  page: number;
  page_size: number;
  setSearch: (search: string) => void;
  setStatus: (status: SubjectStatus | "") => void;
  setInstructor: (instructor: number | "") => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  status: "" as SubjectStatus | "",
  instructor: "" as number | "",
  page: 1,
  page_size: 10,
};

export const useSubjectsStore = create<SubjectsFiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setInstructor: (instructor) => set({ instructor, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ ...initialState }),
}));
