import { z } from "zod";

export const subjectBaseSchema = z
  .object({
    subject_name: z.string().min(2, "Subject name is required"),
    subject_code: z.string().min(2, "Subject code is required"),
    description: z.string().optional(),
    total_marks: z.coerce.number().min(1, "Total marks is required"),
    pass_marks: z.coerce.number().min(0, "Pass marks is required"),
    duration_minutes: z.coerce.number().min(1, "Duration is required"),
    instructor: z.coerce.number().min(1, "Instructor is required"),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine((data) => data.pass_marks <= data.total_marks, {
    message: "Pass marks cannot exceed total marks",
    path: ["pass_marks"],
  });

export type SubjectSchemaInput = z.input<typeof subjectBaseSchema>;
export type SubjectSchemaOutput = z.output<typeof subjectBaseSchema>;
