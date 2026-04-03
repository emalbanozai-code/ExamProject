import { create } from "zustand";

import type { DifficultyLevel } from "../types/question";

interface QuestionsFiltersState {
  search: string;
  subject: number | "";
  difficulty_level: DifficultyLevel | "";
  created_by: number | "";
  page: number;
  page_size: number;
  setSearch: (search: string) => void;
  setSubject: (subject: number | "") => void;
  setDifficulty: (difficulty: DifficultyLevel | "") => void;
  setCreatedBy: (createdBy: number | "") => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  subject: "" as number | "",
  difficulty_level: "" as DifficultyLevel | "",
  created_by: "" as number | "",
  page: 1,
  page_size: 10,
};

export const useQuestionsStore = create<QuestionsFiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setSubject: (subject) => set({ subject, page: 1 }),
  setDifficulty: (difficulty) => set({ difficulty_level: difficulty, page: 1 }),
  setCreatedBy: (createdBy) => set({ created_by: createdBy, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ ...initialState }),
}));
