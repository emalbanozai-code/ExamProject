export type StudentGender = "male" | "female" | "other";
export type StudentStatus = "active" | "inactive";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture?: string | null;
  profile_picture_url?: string | null;
  father_name?: string;
  date_of_birth?: string | null;
  gender: StudentGender;
  address?: string;
  phone_number?: string;
  email: string;
  registration_number: string;
  course_department: string;
  enrollment_date: string;
  status: StudentStatus;
  username: string;
  created_at: string;
  updated_at: string;
}

export type StudentListItem = Student;

export interface PaginatedStudentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentListItem[];
}

export type StudentsListResponse = PaginatedStudentsResponse | StudentListItem[];

export interface StudentListParams {
  search?: string;
  gender?: StudentGender | "";
  status?: StudentStatus | "";
  course_department?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface StudentFormValues {
  first_name: string;
  last_name: string;
  profile_picture?: FileList | null;
  profile_picture_url?: string | null;
  father_name?: string;
  date_of_birth?: string | null;
  gender: StudentGender;
  address?: string;
  phone_number?: string;
  email: string;
  registration_number: string;
  course_department: string;
  enrollment_date: string;
  status: StudentStatus;
  username: string;
  password?: string;
}
