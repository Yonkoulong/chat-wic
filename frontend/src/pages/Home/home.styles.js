import styled, { css } from "styled-components";
import { Box, Typography, Paper } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverBackgroundColor, hoverItemSidebarColor, textColorItemSidebar, primaryColor } from '@/shared/utils/colors.utils';

export const HomeHeaderText = styled(Typography)`
    ${() => css`
        &&& {
            &:hover {
                color: ${primaryColor};
                cursor: pointer;
            }
        }
    `}
`

export const HomeBodyList = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
`

export const HomeBodyItem = styled(Box)`
    display: flex;
    flex: 0 0 calc(33.33333% - 20px);
    flex-direction: column;
    gap: 16px;
            
    &:hover {
        opacity: 0.7;
        cursor: pointer;
    }
`

export const HomeBodyItemImageWrapper = styled(Paper)`
   padding: 16px;
   background-color: #E9E1E1 !important;
   width: fit-content;
   border-radius: 20px;

   display: flex;
   align-items: center;
   justify-content: center;
`


export const HomeBodyItemTile = styled(Typography)`
   
    ${() => css`
        &&& {
            font-size: 18px;
            font-weight: bold;  
        }
    `}
`

export const HomeBodyItemDesc = styled(Typography)`
    ${() => css`
        &&& {
            font-size: 12px;
        }
    `}
`

export const HomeFooterCol = styled(Box)`
    display: flex;
    flex-direction: column;
`

export const HomeFooterItemTitle = styled(Typography)`
    ${() => css`
        &&& {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
        }
    `}
`
export const HomeFooterItemText = styled(`a`)`
    ${() => css`
        &&& {
            font-size: 12px;
            padding: 4px 0;
            display: flex;
            color: #000000;

            &:hover {
                color: ${primaryColor};
                cursor: pointer;
            }
        }
    `}
`