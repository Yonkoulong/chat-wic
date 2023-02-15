import React from "react";
import { useLocation } from "react-router-dom";

import { SignUp } from "@/pages/Auth/SignUp";
import { SignIn } from "@/pages/Auth/SignIn";
import {
  AuthViewContainer,
  AuthViewImageLeft,
  AuthViewContentRight,
  AuthViewImage,
} from "./Auth.styles";
import  AuthImage  from '@/assets/image/backgroundAuth.jpg';
import { useSocket } from "@/shared/hooks/useSocket";

const AuthRoute = {
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
};

export const AuthView = () => {
  let location = useLocation();
  const { client, isConnected } = useSocket({
    initAction : client => console.log(client)
  });

  const handleAuthViewContentComponent = (location) => {
    if (location === AuthRoute.SIGN_UP) {
      return <SignUp />
    }
    if (location === AuthRoute.SIGN_IN) {
      return <SignIn />
    }
  };

  return (
    <AuthViewContainer>
      <AuthViewImageLeft>
        <AuthViewImage src={AuthImage} alt="Auth image" />
      </AuthViewImageLeft>

      <AuthViewContentRight>
        {handleAuthViewContentComponent(location.pathname)};
      </AuthViewContentRight>
    </AuthViewContainer>
  );
};
