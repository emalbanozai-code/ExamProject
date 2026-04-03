import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import { Button, Card, CardContent, Badge, Avatar } from "@/components/ui";
import { useActivateStudent, useDeactivateStudent, useDeleteStudent, useStudent } from "../queries/useStudents";

export default function StudentProfilePage() {
  const { id } = useParams();
  const studentId = Number(id);
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(studentId, Number.isFinite(studentId));
  const activateMutation = useActivateStudent(studentId);
  const deactivateMutation = useDeactivateStudent(studentId);
  const deleteMutation = useDeleteStudent();

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return <div className="text-sm text-error">Invalid student id.</div>;
  }

  if (isLoading || !student) {
    return <div className="text-sm text-text-secondary">Loading student profile...</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(studentId);
    navigate("/students");
  };

  const statusBadge = student.status === "active" ? (
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
        title={`${student.first_name} ${student.last_name}`}
        subtitle={`Reg #: ${student.registration_number}`}
        actions={[
          {
            label: "Edit",
            onClick: () => navigate(`/students/${studentId}/edit`),
          },
          {
            label: student.status === "active" ? "Set Inactive" : "Set Active",
            variant: student.status === "active" ? "outline" : "primary",
            onClick: () =>
              student.status === "active"
                ? deactivateMutation.mutateAsync()
                : activateMutation.mutateAsync(),
          },
        ]}
      />

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center gap-4">
            <Avatar
              src={student.profile_picture_url ?? undefined}
              name={`${student.first_name} ${student.last_name}`}
              size="xl"
            />
            <div>
              <p className="text-xs text-text-secondary">Student</p>
              <p className="text-sm text-text-primary">
                {student.first_name} {student.last_name}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Status</p>
            <div className="mt-1">{statusBadge}</div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Username</p>
            <p className="text-sm text-text-primary mt-1">{student.username}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Email</p>
            <p className="text-sm text-text-primary mt-1">{student.email}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Phone</p>
            <p className="text-sm text-text-primary mt-1">{student.phone_number || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Father Name</p>
            <p className="text-sm text-text-primary mt-1">{student.father_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Date of Birth</p>
            <p className="text-sm text-text-primary mt-1">{student.date_of_birth || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Gender</p>
            <p className="text-sm text-text-primary mt-1">{student.gender}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Address</p>
            <p className="text-sm text-text-primary mt-1">{student.address || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Course / Department</p>
            <p className="text-sm text-text-primary mt-1">{student.course_department}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Enrollment Date</p>
            <p className="text-sm text-text-primary mt-1">{student.enrollment_date}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
          Delete Student
        </Button>
      </div>
    </div>
  );
}
