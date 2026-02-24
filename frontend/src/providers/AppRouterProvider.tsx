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
import { UserProfile } from "@/modules/profile";
import {
  AddMemberPage,
  EditMemberPage,
  MemberProfilePage,
  MembersListPage,
} from "@/modules/members";
import {
  AddStaffPage,
  EditStaffPage,
  StaffListPage,
  StaffProfilePage,
} from "@/modules/staff";

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

        // Profile
        { path: "profile", element: <UserProfile /> },

        // Members
        { path: "members", element: <MembersListPage /> },
        { path: "members/new", element: <AddMemberPage /> },
        { path: "members/:id", element: <MemberProfilePage /> },
        { path: "members/:id/edit", element: <EditMemberPage /> },

        // Staff
        { path: "staff", element: <StaffListPage /> },
        { path: "staff/new", element: <AddStaffPage /> },
        { path: "staff/:id", element: <StaffProfilePage /> },
        { path: "staff/:id/edit", element: <EditStaffPage /> },
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
