import styled, { css } from 'styled-components';
import { Box, Typography } from '@/shared/components';
import { primaryColor } from '@/shared/utils/colors.utils';

export const NavLinkWrapper = styled(Box)`
    display: flex;
    align-items: center;
`

export const NavLinkTitle = styled(Typography)`
    ${({ theme: {  } }) => css`
        &&& {
            margin-left: 16px;
        }
    `}
`