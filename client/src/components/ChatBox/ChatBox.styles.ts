import { styled } from '@mui/material/styles'
import { Box } from '@mui/material';
import { borderColor } from '../../utils/colors.utils';

export const ChatPageContentBox = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
`

export const ChatPageContentBoxMessage = styled(Box)`
    
`

export const ChatPageContentBoxFooter = styled(Box)`
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`

export const ChatPageContentBoxFooterFeature = styled(Box)`
    padding: 16px;
`

export const ChatPageContentBoxFooterTyping = styled(Box)`
    border-top: 1px solid ${borderColor};

`

export const ChatPageContentBoxFooterIpt = styled('input')`
    width: 100%;
    padding: 24px 16px;
    outline: none;
    border: none;
`