import { useMemo } from "react";
import { useSubjectsStore } from "../stores/useSubjectsStore";
import type { SubjectListParams } from "../types/subject";

export const useSubjectFilters = () => {
  const { search, status, instructor, page, page_size, setSearch, setStatus, setInstructor, setPage, reset } =
    useSubjectsStore();

  const params = useMemo<SubjectListParams>(
    () => ({
      search: search || undefined,
      status: status || undefined,
      instructor: instructor || undefined,
      page,
      page_size,
    }),
    [search, status, instructor, page, page_size]
  );

  return {
    search,
    status,
    instructor,
    page,
    page_size,
    setSearch,
    setStatus,
    setInstructor,
    setPage,
    reset,
    params,
  };
};
