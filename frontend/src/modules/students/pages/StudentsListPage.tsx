import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components";
import { Button, Card, CardContent, Input } from "@/components/ui";
import StudentsTable from "../components/StudentsTable";
import { useStudentFilters } from "../hooks/useStudentFilters";
import { useDeleteStudent, useStudentsList } from "../queries/useStudents";
import type { StudentGender, StudentStatus } from "../types/student";

export default function StudentsListPage() {
  const navigate = useNavigate();
  const {
    search,
    gender,
    status,
    course_department,
    setSearch,
    setGender,
    setStatus,
    setCourseDepartment,
    reset,
    params,
  } = useStudentFilters();

  const { data, isLoading } = useStudentsList(params);
  const deleteMutation = useDeleteStudent();
  const students = Array.isArray(data) ? data : data?.results ?? [];

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage student records"
        actions={[
          {
            label: "Add Student",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/students/new"),
          },
        ]}
      />

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <Input
                placeholder="Search by name, email, username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Course/Department"
              value={course_department}
              onChange={(e) => setCourseDepartment(e.target.value)}
              className="min-w-[200px]"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as StudentGender | "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StudentStatus | "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <StudentsTable
        students={students}
        loading={isLoading}
        onRowClick={(student) => navigate(`/students/${student.id}`)}
        onView={(student) => navigate(`/students/${student.id}`)}
        onEdit={(student) => navigate(`/students/${student.id}/edit`)}
        onDelete={(student) => handleDelete(student.id)}
      />
    </div>
  );
}
