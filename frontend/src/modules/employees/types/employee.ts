export type EmployeeRole = "admin" | "instructor" | "staff";
export type EmployeeStatus = "active" | "inactive";
export type WorkDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  father_name?: string;
  date_of_birth?: string | null;
  address?: string;
  phone_number?: string;
  email: string;
  role: EmployeeRole;
  salary: number | string;
  work_days: WorkDay[];
  join_date: string;
  status: EmployeeStatus;
  username: string;
  created_at: string;
  updated_at: string;
}

export type EmployeeListItem = Employee;

export interface PaginatedEmployeesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeListItem[];
}

export type EmployeesListResponse = PaginatedEmployeesResponse | EmployeeListItem[];

export interface EmployeeListParams {
  search?: string;
  role?: EmployeeRole | "";
  status?: EmployeeStatus | "";
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface EmployeeFormValues {
  first_name: string;
  last_name: string;
  father_name?: string;
  date_of_birth?: string | null;
  address?: string;
  phone_number?: string;
  email: string;
  role: EmployeeRole;
  salary: number | string;
  work_days: WorkDay[];
  join_date: string;
  status: EmployeeStatus;
  username: string;
  password?: string;
}
