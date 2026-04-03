import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import StudentForm from "../components/StudentForm";
import { useStudent, useUpdateStudent } from "../queries/useStudents";
import type { StudentFormValues } from "../types/student";

export default function EditStudentPage() {
  const { id } = useParams();
  const studentId = Number(id);
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(studentId, Number.isFinite(studentId));
  const updateMutation = useUpdateStudent(studentId);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return <div className="text-sm text-error">Invalid student id.</div>;
  }

  const handleSubmit = async (values: StudentFormValues) => {
    await updateMutation.mutateAsync(values);
    navigate(`/students/${studentId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={student ? `Edit ${student.first_name} ${student.last_name}` : "Edit Student"}
        subtitle="Update student details"
      />
      <StudentForm
        mode="edit"
        loading={isLoading || updateMutation.isPending}
        initialValues={student}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/students/${studentId}`)}
      />
    </div>
  );
}
