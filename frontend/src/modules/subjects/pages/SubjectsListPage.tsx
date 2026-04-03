import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components";
import { Button, Card, CardContent, Input } from "@/components/ui";
import SubjectsTable from "../components/SubjectsTable";
import { useSubjectFilters } from "../hooks/useSubjectFilters";
import { useDeleteSubject, useInstructorOptions, useSubjectsList } from "../queries/useSubjects";
import type { SubjectStatus } from "../types/subject";

export default function SubjectsListPage() {
  const navigate = useNavigate();
  const {
    search,
    status,
    instructor,
    setSearch,
    setStatus,
    setInstructor,
    reset,
    params,
  } = useSubjectFilters();

  const { data, isLoading } = useSubjectsList(params);
  const { data: instructors } = useInstructorOptions();
  const deleteMutation = useDeleteSubject();
  const subjects = Array.isArray(data) ? data : data?.results ?? [];

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage subjects and courses"
        actions={[
          {
            label: "Add Subject",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/subjects/new"),
          },
        ]}
      />

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <Input
                placeholder="Search by name or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value ? Number(e.target.value) : "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Instructors</option>
              {instructors?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SubjectStatus | "")}
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

      <SubjectsTable
        subjects={subjects}
        loading={isLoading}
        onRowClick={(subject) => navigate(`/subjects/${subject.id}`)}
        onView={(subject) => navigate(`/subjects/${subject.id}`)}
        onEdit={(subject) => navigate(`/subjects/${subject.id}/edit`)}
        onDelete={(subject) => handleDelete(subject.id)}
      />
    </div>
  );
}
