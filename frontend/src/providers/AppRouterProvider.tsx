import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthGuard } from "@/providers";
import {
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "@/modules/auth/index";
import NotFoundPage from "@/pages/PageNotFounded";
import { MISLayout } from "@/components";
import { Dashboard } from "@/modules/dashboard";
import { GeneralSettings, SettingsOverview, UserManagement } from "@settings/index";
import {
  AddEmployeePage,
  EditEmployeePage,
  EmployeeProfilePage,
  EmployeesListPage,
} from "@/modules/employees";
import {
  AddStudentPage,
  EditStudentPage,
  StudentProfilePage,
  StudentsListPage,
} from "@/modules/students";
import {
  AddSubjectPage,
  EditSubjectPage,
  SubjectProfilePage,
  SubjectsListPage,
} from "@/modules/subjects";
import {
  AddQuestionPage,
  EditQuestionPage,
  QuestionProfilePage,
  QuestionsListPage,
} from "@/modules/questions";

function AppRouterProvider() {
  const router = createBrowserRouter([
    // Public Website Routes (CMS)
    {
      path: "/",
      element: (
        <AuthGuard>
          <MISLayout />
        </AuthGuard>
      ),
      errorElement: <NotFoundPage />,
      children: [
        // Dashboard
        { index: true, element: <Dashboard /> },
        // Settings
        { path: "settings", element: <SettingsOverview /> },
        { path: "settings/general", element: <GeneralSettings /> },
        { path: "settings/users", element: <UserManagement /> },

        // Employees
        { path: "employees", element: <EmployeesListPage /> },
        { path: "employees/new", element: <AddEmployeePage /> },
        { path: "employees/:id", element: <EmployeeProfilePage /> },
        { path: "employees/:id/edit", element: <EditEmployeePage /> },

        // Students
        { path: "students", element: <StudentsListPage /> },
        { path: "students/new", element: <AddStudentPage /> },
        { path: "students/:id", element: <StudentProfilePage /> },
        { path: "students/:id/edit", element: <EditStudentPage /> },

        // Subjects
        { path: "subjects", element: <SubjectsListPage /> },
        { path: "subjects/new", element: <AddSubjectPage /> },
        { path: "subjects/:id", element: <SubjectProfilePage /> },
        { path: "subjects/:id/edit", element: <EditSubjectPage /> },

        // Questions
        { path: "questions", element: <QuestionsListPage /> },
        { path: "questions/new", element: <AddQuestionPage /> },
        { path: "questions/:id", element: <QuestionProfilePage /> },
        { path: "questions/:id/edit", element: <EditQuestionPage /> },
      ],
    },

    // MIS Auth Routes (Public)
    {
      path: "/auth/login",
      element: <LoginPage />,
    },
    {
      path: "/auth/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/auth/reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "/auth/verify-email/:token",
      element: <VerifyEmailPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouterProvider;
