import { AuthView } from '@/pages/Auth';
import { ChatHome } from '@/pages/ChatView/ChatHome';

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
    }
  ];