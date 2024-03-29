import { TextField } from "@mui/material";
import styled, { css } from 'styled-components';
import { inActiveColor } from '@/shared/utils/colors.utils';

export const StyledTextField = styled(TextField)`
    ${({ theme: {  } }) => css`
        &&& {

            input {
                padding: 12px 20px;
                font-size: 15px;
            }
        }
  `}
`;