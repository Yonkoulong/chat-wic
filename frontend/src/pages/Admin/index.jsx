import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import {
  AdminPageContainer,
  AdminNavbar,
  AdminNavHead,
  AdminNavHeadLogo,
  AdminNavBody,
  AdminNavBottom,
  AdminContent,
  AdminNavBottomText,
} from "./Admin.styles";
import { redirectTo } from "@/shared/utils/history";
import { Navbar } from './components/Navbar';

export const AdminPage = () => {
  const location = useLocation();

  useEffect(() => {
    if(location?.pathname === "/admin"){
      redirectTo("/admin/dashboard")
    }
  }, [])

  return (
    <AdminPageContainer>
        <AdminNavbar>
            <AdminNavHead>
                <AdminNavHeadLogo>WIC</AdminNavHeadLogo>
            </AdminNavHead>
            <AdminNavBody>
              <Navbar />
            </AdminNavBody>
            <AdminNavBottom>
              <ArrowCircleLeftIcon />
              <AdminNavBottomText onClick={() => redirectTo('/chat')}>Back to chat</AdminNavBottomText>  
            </AdminNavBottom>
        </AdminNavbar>
        <AdminContent>
          <Outlet />
        </AdminContent>
    </AdminPageContainer>);
};
