import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components";
import StudentForm from "../components/StudentForm";
import { useCreateStudent } from "../queries/useStudents";
import type { StudentFormValues } from "../types/student";

export default function AddStudentPage() {
  const navigate = useNavigate();
  const createMutation = useCreateStudent();

  const handleSubmit = async (values: StudentFormValues) => {
    const created = await createMutation.mutateAsync(values);
    navigate(`/students/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Student" subtitle="Create a new student record" />
      <StudentForm
        mode="create"
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/students")}
      />
    </div>
  );
}
