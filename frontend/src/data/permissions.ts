// MIS Permissions
export const permissions = [
  // Core MIS Permissions
  { name: "dashboard", value: "Dashboard" },
  { name: "settings", value: "Settings" },
  { name: "users", value: "Users" },
  { name: "employees", value: "Employees" },
  { name: "students", value: "Students" },
  { name: "subjects", value: "Subjects" },
  { name: "questions", value: "Questions" },
] as const;

export type Permission = (typeof permissions)[number]["name"];

export const routePermissions: Record<string, Permission | Permission[]> = {
  "/": "dashboard",
  "/settings": "settings",
  "/settings/general": "settings",
  "/settings/users": "users",
  "/employees": "employees",
  "/employees/new": "employees",
  "/employees/:id": "employees",
  "/employees/:id/edit": "employees",
  "/students": "students",
  "/students/new": "students",
  "/students/:id": "students",
  "/students/:id/edit": "students",
  "/subjects": "subjects",
  "/subjects/new": "subjects",
  "/subjects/:id": "subjects",
  "/subjects/:id/edit": "subjects",
  "/questions": "questions",
  "/questions/new": "questions",
  "/questions/:id": "questions",
  "/questions/:id/edit": "questions",
};

export const hasRoutePermission = (
  route: string,
  userPermissions: Permission[]
) => {
  const rp = routePermissions[route];
  if (rp === undefined) return true;
  const perm = Array.isArray(rp) ? rp : [rp];
  return perm.some((p) => userPermissions.includes(p));
};
