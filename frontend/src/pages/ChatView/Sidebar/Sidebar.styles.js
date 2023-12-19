import styled, { css } from "styled-components";
import { Box, Typography, Paper } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverItemSidebarColor, textColorItemSidebar } from '@/shared/utils/colors.utils';

export const SidebarContainer = styled(Box)`
    width: 20%;
    min-width: 300px;
    position: relative;
    overflow: hidden;
`

export const SidebarWrapper = styled(Box)`
    background-color: #2F343D;
    height: 100vh;
`

export const SidebarHeader = styled(Box)`
    border-bottom: 1px solid ${borderColor};
    padding: 16px;

`

export const SidebarHeaderList = styled(Box)`
    display: flex;
    gap: 16px;
    align-items: center;
`

export const SidebarHeaderItem = styled(Box)`
    padding: 2px 4px;
    &:hover {
        background-color: ${hoverItemSidebarColor};
        cursor: pointer;
        color: ${whiteColor}
    }
`

export const SidebarHeaderAnchorUserInfo = styled(Box)`

`;

export const SidebarHeaderAnchorUserInfoWrapper = styled(Box)``

export const AnchorUserInfoHeader = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid ${borderColor};

    display: flex;
    align-items: center;
`

export const AnchorUserInfoHeaderImage = styled('img')`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`

export const AnchorUserInfoHeaderContent = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-left: 8px;
`

export const AnchorUserInfoTitleStatus = styled(Box)`
    border-radius: 50%;
    width: 10px;
    height: 10px;
`;

export const AnchorUserInfoTitleName = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
        }
    `}
`;

export const AnchorUserInfoEmail = styled(Typography)`
    ${() => css`
        &&& {
            color: #C7B8B8;
            font-size: 12px;
        }
    `}
`

export const AnchorUserInfoBody = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid ${borderColor};
`

export const AnchorUserInfoBodyTitle = styled(Box)``

export const AnchorUserInfoBodyStatus = styled(Box)`
    border-radius: 50%;
    width: 10px;
    height: 10px;
    border: 1px solid ${borderColor};
`

export const AnchorUserInfoBodyText = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
            font-size: 12px;
        }
    `}
`

export const AnchorUserInfoBottom = styled(Box)`
    padding: 16px;
`

export const AnchorUserInfoBottomList = styled(Box)``

export const AnchorUserInfoBottomItem = styled(Box)``

export const AnchorUserInfoBottomItemText = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
            font-size: 12px;
        }
    `}
`

export const AnchorRoomTitle = styled(Typography)`
    ${() => css`
        &&& {
            font-size: 10px;
        }
    `}
`

export const AnchorRoomWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
`

export const AnchorRoomText = styled(Typography)`
    ${() => css`
        &&& {
            margin-left: 8px;
        }
    `}
`

export const SidebarHeaderItemImage = styled('img')`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`

export const SidebarHeaderItemStatus = styled(Box)`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 0;
`

export const SidebarBody = styled(Box)`
    height: 100%;
`

export const SidebarBodyWrapper = styled(Box)`
    ${() => css`
        &&& {
        padding: 24px 0px;
        overflow: auto;

        -ms-overflow-style: none;/* IE and Edge */
        scrollbar-width: none;  /* Firefox */

        &::-webkit-scrollbar {
            display: none
        };
    }
`}
`

export const SidebarBodyList = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const SidebarBodyItem = styled(Box)`

`

export const SidebarBodyItemName = styled(Box)`
    display: flex;
    al}ign-item: center;
    padding: 0 16px;
`

export const SidebarBodyItemNameText = styled(Typography)`
    ${({ theme: { } }) => css`
    &&& {
        color: ${textColorItemSidebar};
        margin-left: 10px;
    }
  `}
`

export const SidebarBodyListRoom = styled(Box)`

    & > :first-child {
        margin-top: 8px;
    }
`

export const SidebarBodyItemRooms = styled(Box)`
    display: flex;
    flex-direction: column;
`

export const SidebarBodyItemRoomWrapper = styled(Box)`
    display: flex;
    justify-content: space-between;    
    padding: 16px 24px;
    
    &:hover {
        background-color: ${hoverItemSidebarColor};
        cursor: pointer;
    }
`

export const SidebarBodyItemRoomImage = styled('img')`
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
`

export const SidebarBodyItemRoomStatus = styled(Box)`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 0;
`;

export const SidebarBodyItemRoomName = styled(Typography)`
    ${({ theme: { } }) => css`
        &&& {
            color: ${whiteColor};
            font-size: 14px;
        }
    `}
`

export const SidebarBodyItemRoomMessage = styled(Typography)`
    ${({ theme: { } }) => css`
        &&& {
            color: ${textColorItemSidebar};
            font-size: 12px;
        }
    `}
`

export const SidebarBodyItemRoomTime = styled(Typography)`
    ${({ theme: { } }) => css`
        &&& {
            color: ${textColorItemSidebar};
            font-size: 12px;
        }
    `}
`

export const SidebarFooter = styled(Box)`
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    border-top: 1px solid
`

export const SidebarFooterWrapper = styled(Box)`
    padding: 24px 16px;
`

export const SidebarFooterContent = styled(Box)`
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

export const SidebarFooterText = styled(Typography)`
    color: ${whiteColor};
`