import { Typography } from "@mui/material";
import styled, { css } from "styled-components";

export const StyledLabelTextField = styled(Typography)`
  ${({ theme: {  } }) => css`
    &&& {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 8px;
      display: block;
    }
  `}

  .require-field {
    color: red;
  }
`;
