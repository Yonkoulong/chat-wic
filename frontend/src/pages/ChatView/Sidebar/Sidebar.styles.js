import styled, { css } from "styled-components";
import { Box, Typography } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverItemSidebarColor, textColorItemSidebar } from '@/shared/utils/colors.utils';

export const SidebarContainer = styled(Box)`
    width: 20%;
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
    }
`

export const SidebarHeaderAnchorUserInfo = styled(Box)`
    border-radius: 10px;

`;

export const SidebarHeaderAnchorUserInfoWrapper = styled(Box)``

export  const AnchorUserInfoHeader = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid ${blackColor};

    display: flex;
    align-items: center;
`

export const AnchorUserInfoHeaderImage = styled('img')`
    width: 32px;
    height: 32px;
    object-fit: contain;
`

export const AnchorUserInfoHeaderContent = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-left: 8px;
`

export const AnchorUserInfoTitle = styled(Box)``

export const AnchorUserInfoTitleStatus = styled(Box)`
    border-radius: 50%;
    width: 14px;
    height: 14px;
    border: 1px solid ${borderColor};
`;

export const AnchorUserInfoTitleName = styled(Typography)`
    
`;

export const AnchorUserInfoEmail = styled(Typography)`
    ${() => css`
        &&& {
            color: #C7B8B8;
        
        }
    `}
`

export const AnchorUserInfoBody = styled(Box)``

export const AnchorUserInfoBodyTitle = styled(Box)``

export const AnchorUserInfoBodyStatus = styled(Box)``

export const AnchorUserInfoBodyText = styled(Box)``

export const AnchorUserInfoBottom = styled(Box)``

export const AnchorUserInfoBottomList = styled(Box)``

export const AnchorUserInfoBottomItem = styled(Box)``

export const AnchorUserInfoBottomItemText = styled(Typography)``

export const SidebarHeaderItemImage = styled('img')`
    display: flex;
    width: 32px;
    height: 32px;
    object-fit: contain;
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
        margin-left: 14px;
    }
  `}
`

export const SidebarBodyItemRooms = styled(Box)`
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
`

export const SidebarBodyItemRoomWrapper = styled(Box)`
    display: flex;
    align-items: center;
    padding: 4px 16px;
    gap: 6px;

    &:hover {
        background-color: ${hoverItemSidebarColor};
        cursor: pointer;
    }
`

export const SidebarBodyItemRoomImage = styled('img')`
    width: 32px;
    height: 32px;
    object-fit: contain;
`

export const SidebarBodyItemRoomStatus = styled(Box)`
    width: 14px;
    height: 14px;
    border: 1px solid ${whiteColor};
    border-radius: 50%;
`;

export const SidebarBodyItemRoomName = styled(Typography)`
    color: ${textColorItemSidebar};
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