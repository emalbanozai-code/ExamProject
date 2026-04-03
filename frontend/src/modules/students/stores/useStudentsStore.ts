import { create } from "zustand";

import type { StudentGender, StudentStatus } from "../types/student";

interface StudentsFiltersState {
  search: string;
  gender: StudentGender | "";
  status: StudentStatus | "";
  course_department: string;
  page: number;
  page_size: number;
  setSearch: (search: string) => void;
  setGender: (gender: StudentGender | "") => void;
  setStatus: (status: StudentStatus | "") => void;
  setCourseDepartment: (value: string) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  gender: "" as StudentGender | "",
  status: "" as StudentStatus | "",
  course_department: "",
  page: 1,
  page_size: 10,
};

export const useStudentsStore = create<StudentsFiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setGender: (gender) => set({ gender, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setCourseDepartment: (course_department) => set({ course_department, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ ...initialState }),
}));
