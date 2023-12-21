import styled, { css } from "styled-components";
import { Box, Button } from "@/shared/components";
import {
  primaryColor,
  inActiveColor,
  whiteColor,
} from "@/shared/utils/colors.utils";

export const SignUpContainer = styled.div`
  width: 100%;
  padding: 24px 68px;

  @media (max-width: 744px) {
    padding: 24px 16px;
  }
`;

export const SignUpWrapper = styled(Box)``;

export const SignUpLogo = styled.h1`
  font-size: 36px;
  color: ${primaryColor};
`;

export const SignUpTitle = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

export const SignUpTitleHeading = styled("h4")`
  font-size: 24px;
  font-weight: bold;
`;

export const SignUpTitleDesc = styled("p")`
  ${({ theme: {} }) => css`
    font-size: 15px;
    color: ${inActiveColor};
  `}
`;

export const SignUpFormWrapper = styled(Box)`
  margin-top: 48px;
`;

export const SignUpForm = styled("form")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SignUpInputContainer = styled(Box)``;

export const SignUpButtonSubmit = styled(Button)`
  ${({ theme: {} }) => css`
    &&& {
      background-color: ${primaryColor};
      font-size: 15px;
      color: ${whiteColor};
      font-weight: bold;
      border: none;
      outline: none;
      margin-top: 16px;
      padding: 10px 20px;
    }
  `}
`;
