import { z } from "zod";

export const studentBaseSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  profile_picture: z.any().optional(),
  father_name: z.string().optional(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Valid email is required"),
  registration_number: z.string().min(3, "Registration number is required"),
  course_department: z.string().min(2, "Course/Department is required"),
  enrollment_date: z.string().min(1, "Enrollment date is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  username: z.string().min(3, "Username is required"),
});

export const studentCreateSchema = studentBaseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const studentUpdateSchema = studentBaseSchema.extend({
  password: z.string().optional(),
});

export type StudentCreateSchemaInput = z.input<typeof studentCreateSchema>;
export type StudentCreateSchemaOutput = z.output<typeof studentCreateSchema>;
export type StudentUpdateSchemaInput = z.input<typeof studentUpdateSchema>;
export type StudentUpdateSchemaOutput = z.output<typeof studentUpdateSchema>;
