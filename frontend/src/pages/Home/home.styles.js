import styled, { css } from "styled-components";
import { Box, Typography, Paper } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverBackgroundColor, hoverItemSidebarColor, textColorItemSidebar, primaryColor } from '@/shared/utils/colors.utils';


export const HomeContainer = styled(Box)`
    padding: 0;
    display: block;
`

export const HomeHeaderContainer = styled(Box)`
    width: 100%;
    max-width: ${props => props.isfixedheader === "true" ? "100%" : "1200px"};
    margin: 0 auto;
    padding: 0 24px;
    background-color: ${props => props.isfixedheader === "true" ? primaryColor : whiteColor};
    position: ${props => props.isfixedheader == "true" && "sticky"};
    top: ${props => props.isfixedheader === "true" && "0"};
    transition: all 0.5s ease;    
    z-index: 100;
`

export const HomeHeaderWrapper = styled(Box)`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
`

export const HomeHeaderText = styled(Typography)`
    ${() => css`
        &&& {
            color: ${props => props.isfixedheader === "true" ? whiteColor : blackColor};

            &:hover {
                color: ${props => props.isfixedheader === "true" ? whiteColor : primaryColor};
                opacity: ${props => props.isfixedheader === "true" && "0.7"};
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
    max-width: 33.33333%;
    flex-direction: column;
    gap: 16px;
        
    &:hover {
        opacity: 0.7;
        cursor: pointer;
    }

    @media (max-width: 744px) {
        flex: 0 0 calc(50% - 15px);
        max-width: 50%;
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
    
    @media (max-width: 744px) {
        flex: 0 0 50%;
        
        &:not(:nth-child(-n + 2)) {
            margin-top: 16px;
        }
    }
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