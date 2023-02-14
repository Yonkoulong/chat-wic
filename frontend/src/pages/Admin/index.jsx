import React from "react";
import {
  AdminPageContainer,
  AdminNavbar,
  AdminNavHead,
  AdminNavHeadLogo,
  AdminNavBody,
  AdminNavBottom,
  AdminContent,
} from "./Admin.styles";

export const AdminPage = () => {
  return (
    <AdminPageContainer>
        <AdminNavbar>
            <AdminNavHead>
                <AdminNavHeadLogo>WIC</AdminNavHeadLogo>
            </AdminNavHead>
            <AdminNavBody></AdminNavBody>
            <AdminNavBottom>Back to chat</AdminNavBottom>
        </AdminNavbar>
        <AdminContent></AdminContent>
    </AdminPageContainer>);
};
