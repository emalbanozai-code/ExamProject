import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Button, Badge, Avatar } from "@/components/ui";
import type { EmployeeListItem } from "../types/employee";

interface EmployeesTableProps {
  employees: EmployeeListItem[];
  loading?: boolean;
  searchable?: boolean;
  onRowClick?: (employee: EmployeeListItem) => void;
  onView?: (employee: EmployeeListItem) => void;
  onEdit?: (employee: EmployeeListItem) => void;
  onDelete?: (employee: EmployeeListItem) => void;
}

const StatusBadge = ({ status }: { status: EmployeeListItem["status"] }) => {
  if (status === "active") {
    return (
      <Badge variant="success" dot>
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="warning" dot>
      Inactive
    </Badge>
  );
};

export default function EmployeesTable({
  employees,
  loading,
  searchable = false,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  const columns: Column<EmployeeListItem>[] = [
    {
      key: "employee",
      header: "Employee",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.profile_picture_url ?? undefined}
            name={`${row.first_name} ${row.last_name}`}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-xs text-text-secondary truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      label: "Role",
      sortable: true,
      render: (row) => row.role,
    },
    {
      key: "gender",
      header: "Gender",
      label: "Gender",
      sortable: true,
      render: (row) => row.gender,
    },
    {
      key: "email",
      header: "Email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone_number",
      header: "Phone",
      label: "Phone",
      render: (row) => row.phone_number || "-",
    },
    {
      key: "status",
      header: "Status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "join_date",
      header: "Join Date",
      label: "Join Date",
      sortable: true,
      render: (row) => row.join_date,
    },
    {
      key: "salary",
      header: "Salary",
      label: "Salary",
      sortable: true,
      render: (row) => `${Number(row.salary || 0).toLocaleString()}`,
    },
    {
      key: "actions",
      header: "Actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            aria-label="View employee"
            title="View"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) {
                onView(row);
                return;
              }
              onRowClick?.(row);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            aria-label="Edit employee"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            aria-label="Delete employee"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={employees}
      loading={loading}
      searchable={searchable}
      searchPlaceholder="Search employees..."
      searchKeys={["first_name", "last_name", "email", "username", "phone_number"]}
      pagination
      pageSize={10}
      emptyMessage="No employees found"
      onRowClick={onRowClick}
      getRowKey={(row) => row.id}
    />
  );
}
