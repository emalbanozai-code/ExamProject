import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Button, Badge, Avatar } from "@/components/ui";
import type { StudentListItem } from "../types/student";

interface StudentsTableProps {
  students: StudentListItem[];
  loading?: boolean;
  searchable?: boolean;
  onRowClick?: (student: StudentListItem) => void;
  onView?: (student: StudentListItem) => void;
  onEdit?: (student: StudentListItem) => void;
  onDelete?: (student: StudentListItem) => void;
}

const StatusBadge = ({ status }: { status: StudentListItem["status"] }) => {
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

export default function StudentsTable({
  students,
  loading,
  searchable = false,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  const columns: Column<StudentListItem>[] = [
    {
      key: "student",
      header: "Student",
      label: "Student",
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
            <p className="text-xs text-text-secondary truncate">
              {row.registration_number}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "course_department",
      header: "Course/Dept",
      label: "Course/Dept",
      sortable: true,
    },
    {
      key: "gender",
      header: "Gender",
      label: "Gender",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      label: "Email",
    },
    {
      key: "status",
      header: "Status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "enrollment_date",
      header: "Enroll Date",
      label: "Enroll Date",
      sortable: true,
      render: (row) => row.enrollment_date,
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
            aria-label="View student"
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
            aria-label="Edit student"
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
            aria-label="Delete student"
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
      data={students}
      loading={loading}
      searchable={searchable}
      searchPlaceholder="Search students..."
      searchKeys={[
        "first_name",
        "last_name",
        "email",
        "username",
        "registration_number",
      ]}
      pagination
      pageSize={10}
      emptyMessage="No students found"
      onRowClick={onRowClick}
      getRowKey={(row) => row.id}
    />
  );
}
