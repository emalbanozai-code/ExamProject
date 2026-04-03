import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useDeleteQuestion, useQuestion } from "../queries/useQuestions";

const DifficultyBadge = ({ level }: { level: string }) => {
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

export default function QuestionProfilePage() {
  const { id } = useParams();
  const questionId = Number(id);
  const navigate = useNavigate();

  const { data: question, isLoading } = useQuestion(
    questionId,
    Number.isFinite(questionId)
  );
  const deleteMutation = useDeleteQuestion();

  if (!Number.isFinite(questionId) || questionId <= 0) {
    return <div className="text-sm text-error">Invalid question id.</div>;
  }

  if (isLoading || !question) {
    return <div className="text-sm text-text-secondary">Loading question...</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(questionId);
    navigate("/questions");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Details"
        subtitle={question.subject_name || ""}
        actions={[
          {
            label: "Edit",
            onClick: () => navigate(`/questions/${questionId}/edit`),
          },
        ]}
      />

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs text-text-secondary">Question Text</p>
            <p className="text-sm text-text-primary mt-1">{question.question_text}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Subject</p>
            <p className="text-sm text-text-primary mt-1">
              {question.subject_name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Created By</p>
            <p className="text-sm text-text-primary mt-1">
              {question.created_by_name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Difficulty</p>
            <div className="mt-1">
              <DifficultyBadge level={question.difficulty_level} />
            </div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Marks</p>
            <p className="text-sm text-text-primary mt-1">{question.marks}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Correct Answer</p>
            <p className="text-sm text-text-primary mt-1">
              Option {question.correct_answer}
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-text-secondary">Option A</p>
              <p className="text-sm text-text-primary mt-1">{question.option_a}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Option B</p>
              <p className="text-sm text-text-primary mt-1">{question.option_b}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Option C</p>
              <p className="text-sm text-text-primary mt-1">{question.option_c}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Option D</p>
              <p className="text-sm text-text-primary mt-1">{question.option_d}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
          Delete Question
        </Button>
      </div>
    </div>
  );
}
