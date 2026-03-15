import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components";
import EmployeeForm from "../components/EmployeeForm";
import { useCreateEmployee } from "../queries/useEmployees";
import type { EmployeeFormValues } from "../types/employee";

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();

  const handleSubmit = async (values: EmployeeFormValues) => {
    const created = await createMutation.mutateAsync(values);
    navigate(`/employees/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Employee"
        subtitle="Create a new employee record"
      />
      <EmployeeForm
        mode="create"
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/employees")}
      />
    </div>
  );
}
