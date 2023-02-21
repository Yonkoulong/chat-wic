import styled, { css } from 'styled-components';
import { Box, Typography } from '@/shared/components';

export const MemberContainer = styled(Box)`
    padding: 20px;
`

export const LinkStyled = styled(Typography)`
` 

export const MemberContent = styled(Box)``

export const MemberContentHead = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const MemberContentTitle = styled('h4')`
    ${( { theme }) => css`
        &&& {
            font-size: 32px;
        }
    `
    }
`

export const MemberContentAction = styled(Box)``

export const MemberContentBody = styled(Box)``