import { AuthView } from '@/pages/Auth';
import { ChatHome } from '@/pages/ChatView/ChatHome';
import { AdminPage } from '@/pages/Admin';
import { Dashboard } from '@/pages/Admin/Dashboard';
import { Members } from '@/pages/Admin/Members';


export const routes =[
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
      element: <AdminPage />
    },
    {
      path: '/admin/dashboard',
      element: <Dashboard />
    },
    {
      path: '/admin/members',
      element: <Members />
    }
  ];