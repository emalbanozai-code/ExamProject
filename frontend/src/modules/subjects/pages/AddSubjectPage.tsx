import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components";
import SubjectForm from "../components/SubjectForm";
import { useCreateSubject } from "../queries/useSubjects";
import type { SubjectFormValues } from "../types/subject";

export default function AddSubjectPage() {
  const navigate = useNavigate();
  const createMutation = useCreateSubject();

  const handleSubmit = async (values: SubjectFormValues) => {
    const created = await createMutation.mutateAsync(values);
    navigate(`/subjects/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Subject" subtitle="Create a new subject" />
      <SubjectForm
        mode="create"
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/subjects")}
      />
    </div>
  );
}
