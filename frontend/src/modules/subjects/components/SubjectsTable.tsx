import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Button, Badge } from "@/components/ui";
import type { SubjectListItem } from "../types/subject";

interface SubjectsTableProps {
  subjects: SubjectListItem[];
  loading?: boolean;
  searchable?: boolean;
  onRowClick?: (subject: SubjectListItem) => void;
  onView?: (subject: SubjectListItem) => void;
  onEdit?: (subject: SubjectListItem) => void;
  onDelete?: (subject: SubjectListItem) => void;
}

const StatusBadge = ({ status }: { status: SubjectListItem["status"] }) => {
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

export default function SubjectsTable({
  subjects,
  loading,
  searchable = false,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: SubjectsTableProps) {
  const columns: Column<SubjectListItem>[] = [
    {
      key: "subject",
      header: "Subject",
      label: "Subject",
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {row.subject_name}
          </p>
          <p className="text-xs text-text-secondary truncate">{row.subject_code}</p>
        </div>
      ),
    },
    {
      key: "instructor_name",
      header: "Instructor",
      label: "Instructor",
      render: (row) => row.instructor_name || "-",
    },
    {
      key: "total_marks",
      header: "Total Marks",
      label: "Total Marks",
      render: (row) => row.total_marks,
    },
    {
      key: "pass_marks",
      header: "Pass Marks",
      label: "Pass Marks",
      render: (row) => row.pass_marks,
    },
    {
      key: "description",
      header: "Description",
      label: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "duration_minutes",
      header: "Duration",
      label: "Duration",
      render: (row) => `${row.duration_minutes} min`,
    },
    {
      key: "status",
      header: "Status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
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
            aria-label="View subject"
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
            aria-label="Edit subject"
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
            aria-label="Delete subject"
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
      data={subjects}
      loading={loading}
      searchable={searchable}
      searchPlaceholder="Search subjects..."
      searchKeys={["subject_name", "subject_code", "instructor_name"]}
      pagination
      pageSize={10}
      emptyMessage="No subjects found"
      onRowClick={onRowClick}
      getRowKey={(row) => row.id}
    />
  );
}
