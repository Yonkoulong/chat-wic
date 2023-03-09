import styled, { css } from "styled-components";
import { Box, Typography } from '@/shared/components';
import { borderColor, inActiveColor, whiteColor, hoverTextColor } from '@/shared/utils/colors.utils';

export const RoomContentContainer = styled(Box)`
    
`

export const MessageList = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const MessageItem = styled(Box)`
    display: flex;
    padding: 8px 0px 8px 24px;
    position: relative;

    &:hover {
        cursor: pointer;
        background-color: ${hoverTextColor};
    }
`

export const UserImageWrapper = styled(Box)`

`

export const UserImage = styled('img')`
    width: 50px;
    height: 50px;
    object-fit: contain;
`

export const MessageContentWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-left: 16px;
`

export const MessageTitle = styled(Box)`
    display: flex;
    align-items: center;
`

export const UserName = styled(Typography)`
    ${() => css`
        &&& {
            font-size: 18px;
            font-weight: bold;
        }
    `}
`

export const TimeMessage = styled(Typography)`
    ${() => css`
        &&& {
            font-size: 14px;
            color: ${inActiveColor};
            margin-left: 8px; 
        }
    `}
`

export const MessageContentBox = styled(Box)`
    
`

export const InteractMessageWrapper = styled(Box)`
    position: absolute;
    border-radius: 10px;
    border: 2px solid #F8EFEF;
    background-color: ${whiteColor};
    top: -20px;
    right: 10px;
`