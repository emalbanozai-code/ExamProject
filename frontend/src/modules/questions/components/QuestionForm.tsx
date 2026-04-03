import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@components/ui/Input";
import Textarea from "@components/ui/Textarea";
import { Button, Card, CardContent } from "@components/ui";
import { useEmployeeOptions, useSubjectOptions } from "../queries/useQuestions";
import { questionBaseSchema, type QuestionSchemaInput } from "../schemas/questionSchemas";
import type { CorrectAnswerOption, DifficultyLevel, QuestionFormValues } from "../types/question";

interface QuestionFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<QuestionFormValues>;
  loading?: boolean;
  onSubmit: (values: QuestionFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: QuestionFormValues = {
  subject: "",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  marks: 1,
  difficulty_level: "easy",
  created_by: "",
};

export default function QuestionForm({
  mode,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const { data: subjects } = useSubjectOptions();
  const { data: employees } = useEmployeeOptions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionSchemaInput>({
    resolver: zodResolver(questionBaseSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...defaultValues,
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as QuestionFormValues))}
      className="space-y-6"
    >
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Textarea
              label="Question Text"
              rows={4}
              error={errors.question_text?.message}
              {...register("question_text")}
            />
          </div>
          <Input label="Option A" error={errors.option_a?.message} {...register("option_a")} />
          <Input label="Option B" error={errors.option_b?.message} {...register("option_b")} />
          <Input label="Option C" error={errors.option_c?.message} {...register("option_c")} />
          <Input label="Option D" error={errors.option_d?.message} {...register("option_d")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Correct Answer
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("correct_answer")}
            >
              {(["A", "B", "C", "D"] as CorrectAnswerOption[]).map((answer) => (
                <option key={answer} value={answer}>
                  Option {answer}
                </option>
              ))}
            </select>
            {errors.correct_answer && (
              <p className="mt-1.5 text-sm text-error">{errors.correct_answer.message}</p>
            )}
          </div>
          <Input
            label="Marks"
            type="number"
            error={errors.marks?.message}
            {...register("marks")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Difficulty Level
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("difficulty_level")}
            >
              {(["easy", "medium", "hard"] as DifficultyLevel[]).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.difficulty_level && (
              <p className="mt-1.5 text-sm text-error">{errors.difficulty_level.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Subject</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("subject")}
            >
              <option value="">Select subject</option>
              {subjects?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1.5 text-sm text-error">{errors.subject.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Created By
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("created_by")}
            >
              <option value="">Select employee</option>
              {employees?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.created_by && (
              <p className="mt-1.5 text-sm text-error">{errors.created_by.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Question" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
