import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components";
import QuestionForm from "../components/QuestionForm";
import { useCreateQuestion } from "../queries/useQuestions";
import type { QuestionFormValues } from "../types/question";

export default function AddQuestionPage() {
  const navigate = useNavigate();
  const createMutation = useCreateQuestion();

  const handleSubmit = async (values: QuestionFormValues) => {
    const created = await createMutation.mutateAsync(values);
    navigate(`/questions/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Question" subtitle="Create a new question" />
      <QuestionForm
        mode="create"
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/questions")}
      />
    </div>
  );
}
