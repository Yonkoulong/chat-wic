import { styled } from '@mui/material/styles'
import { Box, Typography  } from '@mui/material';

export const ChatPageContainer = styled(Box)`
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
    
`

export const ChatPageContent = styled(Box)`
    width: 80%;
`

//chat page content header
export const ChatPageContentHeader = styled(Box)`
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
`

export const ChatPageContentHeaderTitle = styled(Box)`
    display: flex;
    align-items: center;
`

export const ChatPageContentHeaderTitleIcon = styled(Box)``

export const ChatPageContentHeaderTitleHeading = styled(Typography)``

export const ChatPageContentHeaderList = styled(Box)``

export const ChatPageContentHeaderItem = styled(Box)``
//End chat page content header


export const ChatPageContentMain = styled(Box)`
    height: calc(100% - 78px);
`

