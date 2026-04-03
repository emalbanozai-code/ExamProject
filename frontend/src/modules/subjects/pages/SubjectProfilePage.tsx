import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { useActivateSubject, useDeactivateSubject, useDeleteSubject, useSubject } from "../queries/useSubjects";

export default function SubjectProfilePage() {
  const { id } = useParams();
  const subjectId = Number(id);
  const navigate = useNavigate();

  const { data: subject, isLoading } = useSubject(subjectId, Number.isFinite(subjectId));
  const activateMutation = useActivateSubject(subjectId);
  const deactivateMutation = useDeactivateSubject(subjectId);
  const deleteMutation = useDeleteSubject();

  if (!Number.isFinite(subjectId) || subjectId <= 0) {
    return <div className="text-sm text-error">Invalid subject id.</div>;
  }

  if (isLoading || !subject) {
    return <div className="text-sm text-text-secondary">Loading subject...</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(subjectId);
    navigate("/subjects");
  };

  const statusBadge = subject.status === "active" ? (
    <Badge variant="success" dot>
      Active
    </Badge>
  ) : (
    <Badge variant="warning" dot>
      Inactive
    </Badge>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={subject.subject_name}
        subtitle={`Code: ${subject.subject_code}`}
        actions={[
          {
            label: "Edit",
            onClick: () => navigate(`/subjects/${subjectId}/edit`),
          },
          {
            label: subject.status === "active" ? "Set Inactive" : "Set Active",
            variant: subject.status === "active" ? "outline" : "primary",
            onClick: () =>
              subject.status === "active"
                ? deactivateMutation.mutateAsync()
                : activateMutation.mutateAsync(),
          },
        ]}
      />

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-text-secondary">Status</p>
            <div className="mt-1">{statusBadge}</div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Instructor</p>
            <p className="text-sm text-text-primary mt-1">{subject.instructor_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total Marks</p>
            <p className="text-sm text-text-primary mt-1">{subject.total_marks}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Pass Marks</p>
            <p className="text-sm text-text-primary mt-1">{subject.pass_marks}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Duration</p>
            <p className="text-sm text-text-primary mt-1">{subject.duration_minutes} minutes</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-text-secondary">Description</p>
            <p className="text-sm text-text-primary mt-1">{subject.description || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
          Delete Subject
        </Button>
      </div>
    </div>
  );
}
