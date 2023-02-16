import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import {
  MemberContainer,
  LinkStyled,
  MemberContent,
  MemberContentHead,
  MemberContentTitle,
  MemberContentAction,
  MemberContentBody,
} from "./Members.styles";
import { ButtonCustomize } from "@/shared/components/Button";

export const Members = () => {
  return (
    <MemberContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkStyled>Admin</LinkStyled>
        <LinkStyled>Members</LinkStyled>
      </Breadcrumbs>

      <MemberContent>
        <MemberContentHead>
          <MemberContentTitle>Members</MemberContentTitle>

          <MemberContentAction>
            <ButtonCustomize variant="contained">Delete Members</ButtonCustomize>
            <ButtonCustomize variant="contained">Create Members</ButtonCustomize>
          </MemberContentAction>
        </MemberContentHead>

        <MemberContentBody>{/* table */}</MemberContentBody>
      </MemberContent>
    </MemberContainer>
  );
};
