import React from "react";
import { Outlet } from "react-router-dom";
import {
  AdminPageContainer,
  AdminNavbar,
  AdminNavHead,
  AdminNavHeadLogo,
  AdminNavBody,
  AdminNavBottom,
  AdminContent,
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
            <AdminNavBottom>Back to chat</AdminNavBottom>
        </AdminNavbar>
        <AdminContent>
          <Outlet />
        </AdminContent>
    </AdminPageContainer>);
};
