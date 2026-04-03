import { useMemo } from "react";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import type { QuestionListParams } from "../types/question";

export const useQuestionFilters = () => {
  const {
    search,
    subject,
    difficulty_level,
    created_by,
    page,
    page_size,
    setSearch,
    setSubject,
    setDifficulty,
    setCreatedBy,
    setPage,
    reset,
  } = useQuestionsStore();

  const params = useMemo<QuestionListParams>(
    () => ({
      search: search || undefined,
      subject: subject || undefined,
      difficulty_level: difficulty_level || undefined,
      created_by: created_by || undefined,
      page,
      page_size,
    }),
    [search, subject, difficulty_level, created_by, page, page_size]
  );

  return {
    search,
    subject,
    difficulty_level,
    created_by,
    page,
    page_size,
    setSearch,
    setSubject,
    setDifficulty,
    setCreatedBy,
    setPage,
    reset,
    params,
  };
};
