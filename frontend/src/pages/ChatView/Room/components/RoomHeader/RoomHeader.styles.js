import styled, { css } from 'styled-components';
import { Typography } from '@/shared/components';

export const RoomHeaderItemImage = styled('img')`
    width: 40px;
    height: 40px;
    object-fit: contain;
`

export const RoomHeaderItemName = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
        }
    `}
`