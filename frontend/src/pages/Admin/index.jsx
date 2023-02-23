import React from "react";
import { Outlet } from "react-router-dom";
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

import { Navbar } from './components/Navbar'

export const AdminPage = () => {

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
              <AdminNavBottomText>Back to chat</AdminNavBottomText>  
            </AdminNavBottom>
        </AdminNavbar>
        <AdminContent>
          <Outlet />
        </AdminContent>
    </AdminPageContainer>);
};
