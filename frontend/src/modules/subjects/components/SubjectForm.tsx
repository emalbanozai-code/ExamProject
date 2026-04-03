import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@components/ui/Input";
import Textarea from "@components/ui/Textarea";
import { Button, Card, CardContent } from "@components/ui";
import { useInstructorOptions } from "../queries/useSubjects";
import { subjectBaseSchema, type SubjectSchemaInput } from "../schemas/subjectSchemas";
import type { SubjectFormValues, SubjectStatus } from "../types/subject";

interface SubjectFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<SubjectFormValues>;
  loading?: boolean;
  onSubmit: (values: SubjectFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: SubjectFormValues = {
  subject_name: "",
  subject_code: "",
  description: "",
  total_marks: 0,
  pass_marks: 0,
  duration_minutes: 60,
  instructor: "",
  status: "active",
};

export default function SubjectForm({
  mode,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: SubjectFormProps) {
  const { data: instructors } = useInstructorOptions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectSchemaInput>({
    resolver: zodResolver(subjectBaseSchema),
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
      onSubmit={handleSubmit((values) => onSubmit(values as SubjectFormValues))}
      className="space-y-6"
    >
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Subject Name"
            error={errors.subject_name?.message}
            {...register("subject_name")}
          />
          <Input
            label="Subject Code"
            error={errors.subject_code?.message}
            {...register("subject_code")}
          />
          <Input
            label="Total Marks"
            type="number"
            error={errors.total_marks?.message}
            {...register("total_marks")}
          />
          <Input
            label="Pass Marks"
            type="number"
            error={errors.pass_marks?.message}
            {...register("pass_marks")}
          />
          <Input
            label="Duration (Minutes)"
            type="number"
            error={errors.duration_minutes?.message}
            {...register("duration_minutes")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Instructor
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("instructor")}
            >
              <option value="">Select instructor</option>
              {instructors?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.instructor && (
              <p className="mt-1.5 text-sm text-error">{errors.instructor.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Status</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("status")}
            >
              {(["active", "inactive"] as SubjectStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1.5 text-sm text-error">{errors.status.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              rows={4}
              error={errors.description?.message}
              {...register("description")}
            />
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
          {mode === "create" ? "Create Subject" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
