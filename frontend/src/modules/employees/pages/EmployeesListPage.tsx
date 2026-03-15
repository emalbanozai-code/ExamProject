import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components";
import { Button, Card, CardContent, Input } from "@/components/ui";
import EmployeesTable from "../components/EmployeesTable";
import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import { useDeleteEmployee, useEmployeesList } from "../queries/useEmployees";
import type { EmployeeRole, EmployeeStatus } from "../types/employee";

export default function EmployeesListPage() {
  const navigate = useNavigate();
  const {
    search,
    role,
    status,
    setSearch,
    setRole,
    setStatus,
    reset,
    params,
  } = useEmployeeFilters();

  const { data, isLoading } = useEmployeesList(params);
  const deleteMutation = useDeleteEmployee();
  const employees = Array.isArray(data) ? data : data?.results ?? [];

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage employees and management staff"
        actions={[
          {
            label: "Add Employee",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/employees/new"),
          },
        ]}
      />

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <Input
                placeholder="Search by name, email, username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as EmployeeRole | "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="staff">Staff</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus | "")}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmployeesTable
        employees={employees}
        loading={isLoading}
        onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
        onView={(employee) => navigate(`/employees/${employee.id}`)}
        onEdit={(employee) => navigate(`/employees/${employee.id}/edit`)}
        onDelete={(employee) => handleDelete(employee.id)}
      />
    </div>
  );
}
