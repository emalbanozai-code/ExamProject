import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@components/ui/Input";
import { Button, Card, CardContent } from "@components/ui";
import {
  studentCreateSchema,
  studentUpdateSchema,
  type StudentCreateSchemaInput,
  type StudentUpdateSchemaInput,
} from "../schemas/studentSchemas";
import type { StudentFormValues, StudentGender, StudentStatus } from "../types/student";

interface StudentFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<StudentFormValues>;
  loading?: boolean;
  onSubmit: (values: StudentFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: StudentFormValues = {
  first_name: "",
  last_name: "",
  profile_picture: null,
  father_name: "",
  date_of_birth: null,
  gender: "male",
  address: "",
  phone_number: "",
  email: "",
  registration_number: "",
  course_department: "",
  enrollment_date: "",
  status: "active",
  username: "",
  password: "",
};

export default function StudentForm({
  mode,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const schema = mode === "create" ? studentCreateSchema : studentUpdateSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentCreateSchemaInput | StudentUpdateSchemaInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      password: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...defaultValues,
        ...initialValues,
        password: "",
      });
    }
  }, [initialValues, reset]);

  const selectedProfilePicture = watch("profile_picture") as FileList | null | undefined;
  const existingProfilePictureUrl = initialValues?.profile_picture_url;

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as StudentFormValues))}
      className="space-y-6"
    >
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="First Name" error={errors.first_name?.message} {...register("first_name")} />
          <Input label="Last Name" error={errors.last_name?.message} {...register("last_name")} />
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("profile_picture")}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
            {selectedProfilePicture && selectedProfilePicture.length > 0 && (
              <p className="mt-1 text-xs text-text-secondary">
                Selected: {selectedProfilePicture[0]?.name}
              </p>
            )}
            {!selectedProfilePicture?.length && existingProfilePictureUrl && (
              <p className="mt-1 text-xs text-text-secondary">Current picture is set.</p>
            )}
          </div>
          <Input label="Father Name" error={errors.father_name?.message} {...register("father_name")} />
          <Input
            label="Date of Birth"
            type="date"
            error={errors.date_of_birth?.message}
            {...register("date_of_birth")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Gender</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("gender")}
            >
              {(["male", "female", "other"] as StudentGender[]).map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && <p className="mt-1.5 text-sm text-error">{errors.gender.message}</p>}
          </div>
          <Input label="Address" error={errors.address?.message} {...register("address")} />
          <Input label="Phone Number" error={errors.phone_number?.message} {...register("phone_number")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Registration Number"
            error={errors.registration_number?.message}
            {...register("registration_number")}
          />
          <Input
            label="Course / Department"
            error={errors.course_department?.message}
            {...register("course_department")}
          />
          <Input
            label="Enrollment Date"
            type="date"
            error={errors.enrollment_date?.message}
            {...register("enrollment_date")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Status</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("status")}
            >
              {(["active", "inactive"] as StudentStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1.5 text-sm text-error">{errors.status.message}</p>}
          </div>
          <Input label="Username" error={errors.username?.message} {...register("username")} />
          <Input
            label={mode === "create" ? "Password" : "New Password (optional)"}
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Student" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
