export type SubjectStatus = "active" | "inactive";

export interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
  description?: string;
  total_marks: number;
  pass_marks: number;
  duration_minutes: number;
  instructor: number;
  instructor_name?: string | null;
  status: SubjectStatus;
  created_at: string;
  updated_at: string;
}

export type SubjectListItem = Subject;

export interface PaginatedSubjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubjectListItem[];
}

export type SubjectsListResponse = PaginatedSubjectsResponse | SubjectListItem[];

export interface SubjectListParams {
  search?: string;
  status?: SubjectStatus | "";
  instructor?: number | "";
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface SubjectFormValues {
  subject_name: string;
  subject_code: string;
  description?: string;
  total_marks: number | string;
  pass_marks: number | string;
  duration_minutes: number | string;
  instructor: number | "";
  status: SubjectStatus;
}

export interface InstructorOption {
  value: number;
  label: string;
}
