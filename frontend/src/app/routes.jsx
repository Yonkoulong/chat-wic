import { AuthView } from "@/pages/Auth";
import { HomePage } from "@/pages/Home";
import { ChatHome } from "@/pages/ChatView/ChatHome";
import { AdminPage } from "@/pages/Admin";
import { Dashboard } from "@/pages/Admin/Dashboard";
import { Members } from "@/pages/Admin/Members";
import { EditMember } from "@/pages/Admin/Members/components/EditMember";
import { ChatView } from "@/pages/ChatView";
import { PageNotFound } from "@/pages/404";
import { ProtectedRoute, AuthorizationRoute } from "@/shared/HOC";
import { enumRoles } from "@/shared/utils/constant";
import { RoomChat } from '@/pages/ChatView/Room';

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    exact: true,
    element: <AuthView />,
  },
  {
    path: "/signin",
    exact: true,
    element: <AuthView />,
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
    element: (
      <ProtectedRoute>
        <ChatView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/chat/home',
        element: <ChatHome />
      },
      {
        path: '/chat/channel/:id',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/threads',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/threads/:threadId',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/members',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/message',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/files',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/todo-list',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/todo-detail',
        element: <RoomChat />
      },
      {
        path: '/chat/channel/:id/room-info',
        element: <RoomChat />
      },
      {
        path: '/chat/direct/:id',
        element: <RoomChat />
      },
      {
        path: '/chat/direct/:id/message',
        element: <RoomChat />
      },
      {
        path: '/chat/direct/:id/files',
        element: <RoomChat />
      },
      {
        path: '/chat/direct/:id/user-info',
        element: <RoomChat />
      },
    ]
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];
