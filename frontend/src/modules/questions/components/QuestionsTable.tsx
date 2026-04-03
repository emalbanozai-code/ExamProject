import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Badge, Button } from "@/components/ui";
import type { DifficultyLevel, QuestionListItem } from "../types/question";

interface QuestionsTableProps {
  questions: QuestionListItem[];
  loading?: boolean;
  searchable?: boolean;
  onRowClick?: (question: QuestionListItem) => void;
  onView?: (question: QuestionListItem) => void;
  onEdit?: (question: QuestionListItem) => void;
  onDelete?: (question: QuestionListItem) => void;
}

const DifficultyBadge = ({ level }: { level: DifficultyLevel }) => {
  if (level === "easy") {
    return (
      <Badge variant="success" dot>
        Easy
      </Badge>
    );
  }
  if (level === "medium") {
    return (
      <Badge variant="warning" dot>
        Medium
      </Badge>
    );
  }
  return (
    <Badge variant="danger" dot>
      Hard
    </Badge>
  );
};

const getQuestionSummary = (text: string) => {
  const trimmed = text?.trim?.() ?? "";
  if (trimmed.length <= 80) {
    return trimmed || "-";
  }
  return `${trimmed.slice(0, 77)}...`;
};

export default function QuestionsTable({
  questions,
  loading,
  searchable = false,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: QuestionsTableProps) {
  const columns: Column<QuestionListItem>[] = [
    {
      key: "question",
      header: "Question",
      label: "Question",
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {getQuestionSummary(row.question_text)}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {row.subject_name || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "difficulty_level",
      header: "Difficulty",
      label: "Difficulty",
      render: (row) => <DifficultyBadge level={row.difficulty_level} />,
    },
    {
      key: "marks",
      header: "Marks",
      label: "Marks",
      render: (row) => row.marks,
    },
    {
      key: "correct_answer",
      header: "Correct",
      label: "Correct",
      render: (row) => `Option ${row.correct_answer}`,
    },
    {
      key: "created_by_name",
      header: "Created By",
      label: "Created By",
      render: (row) => row.created_by_name || "-",
    },
    {
      key: "actions",
      header: "Actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            aria-label="View question"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) {
                onView(row);
                return;
              }
              onRowClick?.(row);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            aria-label="Edit question"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            aria-label="Delete question"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={questions}
      loading={loading}
      searchable={searchable}
      searchPlaceholder="Search questions..."
      searchKeys={["question_text", "subject_name", "created_by_name"]}
      pagination
      pageSize={10}
      emptyMessage="No questions found"
      onRowClick={onRowClick}
      getRowKey={(row) => row.id}
    />
  );
}
