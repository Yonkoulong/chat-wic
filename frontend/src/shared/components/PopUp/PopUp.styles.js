import { DialogContentText, Button, Typography } from "@/shared/components";
import styled, { css } from "styled-components";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

export const IconSuccess = styled(CheckCircleIcon)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.secondary.light};
      width: 18%;
      height: 18%;
    }
  `}
`;

export const IconWarning = styled(ErrorIcon)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.secondary.warning};
      width: 18%;
      height: 18%;
    }
  `}
`;

export const IconError = styled(CloseIcon)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.text.high};
      background-color: ${palette.secondary.warning};
      border-radius: 50%;
      width: 18%;
      height: 18%;
    }
  `}
`;

export const TextPopUp = styled(DialogContentText)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.secondary.popUpText};
      padding: 0 18px;
    }
  `}
`;
export const TextPopUpConfirm = styled(DialogContentText)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.secondary.popUpText};
      padding: 0 18px;
      text-align: center;
    }
  `}
`;

export const ButtonConFirm = styled(Button)`
  ${({ theme: { palette } }) => css`
    &&& {
      background-color: ${palette.secondary.light};
      color: ${palette.common.white};
      width: 100%;
      padding: 10px 20px;
    }
  `}
`;

export const ButtonActionConfirm = styled(Button)`
  ${({ theme: { palette } }) => css`
    &&& {
      border-color: ${palette.background.level2};
      background-color: ${palette.secondary.light};
      color: ${palette.common.white};
      font-weight: 600;
      width: 100%;
      padding: 14px 20px;
      margin-left: 10px;
    }
  `}
`;

export const ButtonActionCanCel = styled(Button)`
  ${({ theme: { palette } }) => css`
    &&& {
      border: 1px solid ${palette.background.level2};
      background-color: ${theme.palette.common.white};
      color: ${palette.secondary.main};
      font-weight: 600;
      width: 100%;
      padding: 14px 20px;
      margin-left: 10px;
    }
  `}
`;

export const DialogHeader = styled(Typography)`
  ${({ theme: { palette } }) => css`
    &&& {
      color: ${palette.common.black};
      font-weight: 700;
      font-size: 32px;
      margin: 20px 0;
    }
  `}
`;
