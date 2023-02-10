import { AuthView } from '@/pages/Auth';

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
    }
  ];