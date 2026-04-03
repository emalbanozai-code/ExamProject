import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import SubjectForm from "../components/SubjectForm";
import { useSubject, useUpdateSubject } from "../queries/useSubjects";
import type { SubjectFormValues } from "../types/subject";

export default function EditSubjectPage() {
  const { id } = useParams();
  const subjectId = Number(id);
  const navigate = useNavigate();

  const { data: subject, isLoading } = useSubject(subjectId, Number.isFinite(subjectId));
  const updateMutation = useUpdateSubject(subjectId);

  if (!Number.isFinite(subjectId) || subjectId <= 0) {
    return <div className="text-sm text-error">Invalid subject id.</div>;
  }

  const handleSubmit = async (values: SubjectFormValues) => {
    await updateMutation.mutateAsync(values);
    navigate(`/subjects/${subjectId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={subject ? `Edit ${subject.subject_name}` : "Edit Subject"}
        subtitle="Update subject details"
      />
      <SubjectForm
        mode="edit"
        loading={isLoading || updateMutation.isPending}
        initialValues={subject}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/subjects/${subjectId}`)}
      />
    </div>
  );
}
