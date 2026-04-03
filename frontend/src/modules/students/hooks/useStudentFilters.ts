import { useMemo } from "react";
import { useStudentsStore } from "../stores/useStudentsStore";
import type { StudentListParams } from "../types/student";

export const useStudentFilters = () => {
  const {
    search,
    gender,
    status,
    course_department,
    page,
    page_size,
    setSearch,
    setGender,
    setStatus,
    setCourseDepartment,
    setPage,
    reset,
  } = useStudentsStore();

  const params = useMemo<StudentListParams>(
    () => ({
      search: search || undefined,
      gender: gender || undefined,
      status: status || undefined,
      course_department: course_department || undefined,
      page,
      page_size,
    }),
    [search, gender, status, course_department, page, page_size]
  );

  return {
    search,
    gender,
    status,
    course_department,
    page,
    page_size,
    setSearch,
    setGender,
    setStatus,
    setCourseDepartment,
    setPage,
    reset,
    params,
  };
};
