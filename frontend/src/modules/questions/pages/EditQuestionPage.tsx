import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import QuestionForm from "../components/QuestionForm";
import { useQuestion, useUpdateQuestion } from "../queries/useQuestions";
import type { QuestionFormValues } from "../types/question";

export default function EditQuestionPage() {
  const { id } = useParams();
  const questionId = Number(id);
  const navigate = useNavigate();

  const { data: question, isLoading } = useQuestion(
    questionId,
    Number.isFinite(questionId)
  );
  const updateMutation = useUpdateQuestion(questionId);

  if (!Number.isFinite(questionId) || questionId <= 0) {
    return <div className="text-sm text-error">Invalid question id.</div>;
  }

  const handleSubmit = async (values: QuestionFormValues) => {
    await updateMutation.mutateAsync(values);
    navigate(`/questions/${questionId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Question" subtitle="Update question details" />
      <QuestionForm
        mode="edit"
        loading={isLoading || updateMutation.isPending}
        initialValues={question}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/questions/${questionId}`)}
      />
    </div>
  );
}
