import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@components/ui/Input";
import { Button, Card, CardContent } from "@components/ui";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  type EmployeeCreateSchemaInput,
  type EmployeeUpdateSchemaInput,
} from "../schemas/employeeSchemas";
import type { EmployeeFormValues, EmployeeRole, EmployeeStatus, WorkDay } from "../types/employee";

const WORK_DAY_OPTIONS: { value: WorkDay; label: string }[] = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

interface EmployeeFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<EmployeeFormValues>;
  loading?: boolean;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: EmployeeFormValues = {
  first_name: "",
  last_name: "",
  father_name: "",
  date_of_birth: null,
  address: "",
  phone_number: "",
  email: "",
  role: "staff",
  salary: 0,
  work_days: [],
  join_date: "",
  status: "active",
  username: "",
  password: "",
};

export default function EmployeeForm({
  mode,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const schema = mode === "create" ? employeeCreateSchema : employeeUpdateSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeCreateSchemaInput | EmployeeUpdateSchemaInput>({
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

  const workDays = watch("work_days") as WorkDay[] | undefined;

  const toggleWorkDay = (day: WorkDay) => {
    const next = new Set(workDays ?? []);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    setValue("work_days", Array.from(next) as WorkDay[], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as EmployeeFormValues))}
      className="space-y-6"
    >
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="First Name"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <Input
            label="Last Name"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
          <Input
            label="Father Name"
            error={errors.father_name?.message}
            {...register("father_name")}
          />
          <Input
            label="Date of Birth"
            type="date"
            error={errors.date_of_birth?.message}
            {...register("date_of_birth")}
          />
          <Input
            label="Address"
            error={errors.address?.message}
            {...register("address")}
          />
          <Input
            label="Phone Number"
            error={errors.phone_number?.message}
            {...register("phone_number")}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label={mode === "create" ? "Password" : "New Password (optional)"}
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Salary"
            type="number"
            step="0.01"
            error={errors.salary?.message}
            {...register("salary")}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("role")}
            >
              {(["admin", "instructor", "staff"] as EmployeeRole[]).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1.5 text-sm text-error">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Status
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("status")}
            >
              {(["active", "inactive"] as EmployeeStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1.5 text-sm text-error">{errors.status.message}</p>
            )}
          </div>

          <Input
            label="Join Date"
            type="date"
            error={errors.join_date?.message}
            {...register("join_date")}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Work Days
            </label>
            <input type="hidden" {...register("work_days")} />
            <div className="flex flex-wrap gap-3">
              {WORK_DAY_OPTIONS.map((day) => (
                <label key={day.value} className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={(workDays ?? []).includes(day.value)}
                    onChange={() => toggleWorkDay(day.value)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {day.label}
                </label>
              ))}
            </div>
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
          {mode === "create" ? "Create Employee" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
