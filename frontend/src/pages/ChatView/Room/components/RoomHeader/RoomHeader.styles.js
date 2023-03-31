import styled, { css } from 'styled-components';
import { Typography } from '@/shared/components';

export const RoomHeaderItemImage = styled('img')`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const RoomHeaderItemName = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
        }
    `}
`