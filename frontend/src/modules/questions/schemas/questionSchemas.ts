import { z } from "zod";

export const questionBaseSchema = z.object({
  subject: z.coerce.number().min(1, "Subject is required"),
  question_text: z.string().min(5, "Question text is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().min(1, "Option C is required"),
  option_d: z.string().min(1, "Option D is required"),
  correct_answer: z.enum(["A", "B", "C", "D"], {
    required_error: "Correct answer is required",
  }),
  marks: z.coerce.number().min(1, "Marks is required"),
  difficulty_level: z.enum(["easy", "medium", "hard"]).default("easy"),
  created_by: z.coerce.number().min(1, "Created by is required"),
});

export type QuestionSchemaInput = z.input<typeof questionBaseSchema>;
export type QuestionSchemaOutput = z.output<typeof questionBaseSchema>;
