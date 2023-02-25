import styled, { css } from "styled-components";
import { Box, Typography } from "@/shared/components";

export const MemberContainer = styled(Box)`
  padding: 20px 32px;
`;

export const LinkStyled = styled(Typography)``;

export const MemberContent = styled(Box)`
  padding: 40px 0;
`;

export const MemberContentHead = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MemberContentTitle = styled("h4")`
  ${({ theme }) => css`
    &&& {
      font-size: 32px;
    }
  `}
`;

export const MemberContentAction = styled(Box)`
  display: flex;
`;

export const MemberContentBody = styled(Box)`
  margin-top: 32px;
`;
