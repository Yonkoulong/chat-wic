import { AuthView } from '@/pages/Auth';
import { ChatHome } from '@/pages/ChatView/ChatHome';
import { AdminPage } from '@/pages/Admin';
import { Dashboard } from '@/pages/Admin/Dashboard';
import { Members } from '@/pages/Admin/Members';
import { createBrowserRouter } from 'react-router-dom';


export const routes = [
  {
    path: "/",
    element: <div>Hello</div>
  },
  {
    path: "/signup",
    element: <AuthView />
  },
  {
    path: "/signin",
    element: <AuthView />
  },
  {
    path: "/home",
    element: <ChatHome />
  },
  {
    path: '/admin',
    element: <AdminPage />,
    children: [
      {
        path: '/admin/dashboard',
        element: <Dashboard />
      },
      {
        path: '/admin/members',
        element: <Members />,
        children: [
          {
            path: '/admin/members/edit',
            element: <></>
          }
        ]
      }
    ]
  },
];