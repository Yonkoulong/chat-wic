import styled, { css } from 'styled-components';
import { Box, Typography } from '@/shared/components';

import { borderColor, inActiveColor, blackColor } from '@/shared/utils/colors.utils';

export const LinkStyled = styled(Typography)``

export const EditMemberContainer = styled(Box)`
    padding: 20px 32px;
`;

export const EditMemberContent = styled(Box)`
    padding: 40px 0;
`;

export const EditMemberContentHead = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between`;

export const EditMemberContentHeadItem = styled(Box)`
    display: flex;
    align-items: center;
`

export const EditMemberContentTitle = styled(Typography)`
    ${({ theme }) => css`
        &&& {
            font-size: 32px;
            font-weight: 700;
            margin-left: 8px;
        }
    `}
`;

export const EditMemberContentForm = styled('form')`
   
`

export const EditMemberContentInfo = styled(Box)`
    margin-top: 32px;
    border: 3px solid ${borderColor};
    padding: 24px 38px;

    display: flex;
    flex-direction: column;
    gap: 24px;
`;


export const EditMemberInfoRow = styled(Box)`
    display: flex;
`;

export const EditMemberInfoItem = styled(Box)`
    flex-basis: 50%;
`;

export const EditMemberInfoItemTitle = styled(Typography)(({ props }) => ({
    color: props ? inActiveColor : blackColor
}));


export const EditMemberInfoItemValue = styled(Box)`
    width: 50%;
`;

export const EditMemberAction = styled(Box)`
        display: flex;
        align-items: center;
        margin-top: 24px;
`;