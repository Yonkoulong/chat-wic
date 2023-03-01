import { AuthView } from "@/pages/Auth";
import { ChatHome } from "@/pages/ChatView/ChatHome";
import { AdminPage } from "@/pages/Admin";
import { Dashboard } from "@/pages/Admin/Dashboard";
import { Members } from "@/pages/Admin/Members";
import { EditMember } from "@/pages/Admin/Members/components/EditMember";
import { ChatView } from "@/pages/ChatView";
import { PageNotFound } from "@/pages/404";
import { ProtectedRoute, AuthorizationRoute } from "@/shared/HOC";
import { enumRoles } from "@/shared/utils/constant";

export const routes = [
  {
    path: "/",
    element: <div>Hello</div>,
  },
  {
    path: "/signup",
    element: <AuthView />,
  },
  {
    path: "/signin",
    element: <AuthView />,
  },
  {
    path: "/home",
    element: <ChatHome />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AuthorizationRoute allowRoles={[enumRoles.ADMIN]}>
          <AdminPage />
        </AuthorizationRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/members",
        element: <Members />,
      },
      {
        path: "/admin/members/:id",
        element: <EditMember />,
      },
    ],
  },
  {
    path: '/chat',
    element: <ProtectedRoute><ChatView /></ProtectedRoute>,
    children: [
      {
        path: '',
        element: ''
      }
    ]
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];
