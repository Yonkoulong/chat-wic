import styled, { css } from "styled-components";
import { Box, Typography } from '@/shared/components'; 

export const ChatViewContainer = styled(Box)`
    width: 100%;
    display: flex;
    overflow: hidden;
`

export const ChatViewWrapper = styled(Box)`
    width: 80%;
    display: flex;
    flex-direction: column;
    position: relative;

    @media (max-width: 1024px) {
        width: 100%;
        min-width 100%;
    }
`

export const ChatViewOverlay = styled(Box)`
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    transition background-color .5s ease;
`

export const MobileHeadWrapper = styled(Box)`
    display: none;
    padding: 16px;
    align-items: center;
    justify-content: space-between;
    box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;

    @media (max-width: 1024px) {
        display: flex;
    }
`

export const MobileHeadText = styled(Typography)`    
`