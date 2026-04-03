import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components";
import { Button, Card, CardContent, Input } from "@/components/ui";
import QuestionsTable from "../components/QuestionsTable";
import { useQuestionFilters } from "../hooks/useQuestionFilters";
import {
  useDeleteQuestion,
  useEmployeeOptions,
  useQuestionsList,
  useSubjectOptions,
} from "../queries/useQuestions";
import type { DifficultyLevel } from "../types/question";

export default function QuestionsListPage() {
  const navigate = useNavigate();
  const {
    search,
    subject,
    difficulty_level,
    created_by,
    setSearch,
    setSubject,
    setDifficulty,
    setCreatedBy,
    reset,
    params,
  } = useQuestionFilters();

  const { data, isLoading } = useQuestionsList(params);
  const { data: subjects } = useSubjectOptions();
  const { data: employees } = useEmployeeOptions();
  const deleteMutation = useDeleteQuestion();
  const questions = Array.isArray(data) ? data : data?.results ?? [];

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Questions"
        subtitle="Manage question bank"
        actions={[
          {
            label: "Add Question",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/questions/new"),
          },
        ]}
      />

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <Input
                placeholder="Search by question text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value ? Number(e.target.value) : "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Subjects</option>
              {subjects?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={difficulty_level}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={created_by}
              onChange={(e) => setCreatedBy(e.target.value ? Number(e.target.value) : "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Employees</option>
              {employees?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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

      <QuestionsTable
        questions={questions}
        loading={isLoading}
        onRowClick={(question) => navigate(`/questions/${question.id}`)}
        onView={(question) => navigate(`/questions/${question.id}`)}
        onEdit={(question) => navigate(`/questions/${question.id}/edit`)}
        onDelete={(question) => handleDelete(question.id)}
      />
    </div>
  );
}
