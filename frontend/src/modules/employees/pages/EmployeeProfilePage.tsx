import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components";
import { Button, Card, CardContent, Badge, Avatar } from "@/components/ui";
import { useActivateEmployee, useDeactivateEmployee, useDeleteEmployee, useEmployee } from "../queries/useEmployees";

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const employeeId = Number(id);
  const navigate = useNavigate();

  const { data: employee, isLoading } = useEmployee(employeeId, Number.isFinite(employeeId));
  const activateMutation = useActivateEmployee(employeeId);
  const deactivateMutation = useDeactivateEmployee(employeeId);
  const deleteMutation = useDeleteEmployee();

  if (!Number.isFinite(employeeId) || employeeId <= 0) {
    return <div className="text-sm text-error">Invalid employee id.</div>;
  }

  if (isLoading || !employee) {
    return <div className="text-sm text-text-secondary">Loading employee profile...</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(employeeId);
    navigate("/employees");
  };

  const statusBadge = employee.status === "active" ? (
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
        title={`${employee.first_name} ${employee.last_name}`}
        subtitle={`Role: ${employee.role}`}
        actions={[
          {
            label: "Edit",
            onClick: () => navigate(`/employees/${employeeId}/edit`),
          },
          {
            label: employee.status === "active" ? "Set Inactive" : "Set Active",
            variant: employee.status === "active" ? "outline" : "primary",
            onClick: () =>
              employee.status === "active"
                ? deactivateMutation.mutateAsync()
                : activateMutation.mutateAsync(),
          },
        ]}
      />

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center gap-4">
            <Avatar
              src={employee.profile_picture_url ?? undefined}
              name={`${employee.first_name} ${employee.last_name}`}
              size="xl"
            />
            <div>
              <p className="text-xs text-text-secondary">Employee</p>
              <p className="text-sm text-text-primary">
                {employee.first_name} {employee.last_name}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Status</p>
            <div className="mt-1">{statusBadge}</div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Username</p>
            <p className="text-sm text-text-primary mt-1">{employee.username}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Email</p>
            <p className="text-sm text-text-primary mt-1">{employee.email}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Phone</p>
            <p className="text-sm text-text-primary mt-1">{employee.phone_number || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Father Name</p>
            <p className="text-sm text-text-primary mt-1">{employee.father_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Date of Birth</p>
            <p className="text-sm text-text-primary mt-1">{employee.date_of_birth || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Gender</p>
            <p className="text-sm text-text-primary mt-1">{employee.gender}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Address</p>
            <p className="text-sm text-text-primary mt-1">{employee.address || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Join Date</p>
            <p className="text-sm text-text-primary mt-1">{employee.join_date}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Salary</p>
            <p className="text-sm text-text-primary mt-1">
              {Number(employee.salary || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Work Days</p>
            <p className="text-sm text-text-primary mt-1">
              {employee.work_days?.length ? employee.work_days.join(", ") : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
          Delete Employee
        </Button>
      </div>
    </div>
  );
}
