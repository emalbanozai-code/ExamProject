import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import EmployeeForm from "../components/EmployeeForm";
import { useEmployee, useUpdateEmployee } from "../queries/useEmployees";
import type { EmployeeFormValues } from "../types/employee";

export default function EditEmployeePage() {
  const { id } = useParams();
  const employeeId = Number(id);
  const navigate = useNavigate();

  const { data: employee, isLoading } = useEmployee(employeeId, Number.isFinite(employeeId));
  const updateMutation = useUpdateEmployee(employeeId);

  if (!Number.isFinite(employeeId) || employeeId <= 0) {
    return <div className="text-sm text-error">Invalid employee id.</div>;
  }

  const handleSubmit = async (values: EmployeeFormValues) => {
    await updateMutation.mutateAsync(values);
    navigate(`/employees/${employeeId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={employee ? `Edit ${employee.first_name} ${employee.last_name}` : "Edit Employee"}
        subtitle="Update employee details"
      />
      <EmployeeForm
        mode="edit"
        loading={isLoading || updateMutation.isPending}
        initialValues={employee}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/employees/${employeeId}`)}
      />
    </div>
  );
}
