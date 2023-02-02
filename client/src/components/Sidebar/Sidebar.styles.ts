import { styled } from '@mui/material/styles'
import { Box } from '@mui/material';

import { borderColor } from '../../utils/colors.utils';

export const SidebarContainer = styled(Box)`
    width: 20%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${borderColor};
    position: relative;
`

//Sidebar header
export const SiderbarHeader = styled(Box)`
    padding: 24px;
    border-bottom: 1px solid ${borderColor};
`
export const SidebarHeaderList = styled(Box)`

`

export const SidebarHeaderItem = styled(Box)`

`
//End Sidebar header

//Sidebar main 
export const SidebarMain = styled(Box)`
    padding: 24px;
`
//End Sidebar main

//Sidebar footer
export const SidebarFooter = styled(Box)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    border-top: 1px solid ${borderColor};
`
//End Sidebar footer