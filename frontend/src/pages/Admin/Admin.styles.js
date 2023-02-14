import styled, { css } from 'styled-components';
import { Box } from '@/shared/components';
import { primaryColor } from '@/shared/utils/colors.utils';

export const AdminPageContainer = styled(Box)`
    width: 100%;
    height: 100vh;
    display: flex;
`

export const AdminNavbar = styled(Box)`
    width: 20%;
    background-color: #E0D5D5;
    padding: 16px;
`;

export const AdminNavHead = styled(Box)``;

export const AdminNavHeadLogo = styled('h4')`
    ${({ theme: {} }) => css`
        font-size: 32px;
        color: ${primaryColor};
    `}
`

export const AdminNavBody = styled(Box)``;

export const AdminNavBottom = styled(Box)``;

export const AdminContent = styled(Box)`
    width: 80%;
`;