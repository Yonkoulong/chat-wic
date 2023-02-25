import styled, { css } from "styled-components";
import { Box } from "@/shared/components";
import { primaryColor, inActiveColor } from "@/shared/utils/colors.utils";
import { Typography } from "@mui/material";

export const AdminPageContainer = styled(Box)`
  width: 100%;
  
`;

export const AdminNavbar = styled(Box)`
  height: 100vh;
  width: 20%;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  
  overflow: auto;
  -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  background-color: #e0d5d5;
`;

export const AdminNavHead = styled(Box)`
  padding: 16px;
`;

export const AdminNavHeadLogo = styled("h4")`
  ${({ theme: {} }) => css`
    font-size: 32px;
    color: ${primaryColor};
  `}
`;

export const AdminNavBody = styled(Box)`
  padding: 40px 16px 0;
`;

export const AdminNavBottom = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top: 1px solid ${primaryColor};
  padding: 16px;
  color: ${inActiveColor};

  display: flex;
  align-items: center;

  &:hover {
    color: ${primaryColor};
    cursor: pointer;
  }
`;

export const AdminNavBottomText = styled(Typography)`
  ${({ theme: {} }) => css`
    &&& {
      display: flex;
      margin-left: 8px;
    }
  `}
`;

export const AdminContent = styled(Box)`
  width: 100%;
  padding-left: 20%;
`;
