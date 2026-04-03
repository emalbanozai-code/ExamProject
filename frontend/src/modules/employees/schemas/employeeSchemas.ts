import { z } from "zod";

const workDayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);

export const employeeBaseSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  profile_picture: z.any().optional(),
  father_name: z.string().optional(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "instructor", "staff"]),
  salary: z.coerce.number().min(0, "Salary must be 0 or more"),
  work_days: z.array(workDayEnum).optional().default([]),
  join_date: z.string().min(1, "Join date is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  username: z.string().min(3, "Username is required"),
});

export const employeeCreateSchema = employeeBaseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const employeeUpdateSchema = employeeBaseSchema.extend({
  password: z.string().optional(),
});

export type EmployeeCreateSchemaInput = z.input<typeof employeeCreateSchema>;
export type EmployeeCreateSchemaOutput = z.output<typeof employeeCreateSchema>;
export type EmployeeUpdateSchemaInput = z.input<typeof employeeUpdateSchema>;
export type EmployeeUpdateSchemaOutput = z.output<typeof employeeUpdateSchema>;
