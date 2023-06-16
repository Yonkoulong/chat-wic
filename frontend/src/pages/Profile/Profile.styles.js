import styled, { css } from "styled-components";
import { Box, Typography, Paper } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverBackgroundColor, hoverItemSidebarColor, textColorItemSidebar, primaryColor } from '@/shared/utils/colors.utils';

import { ThemeProvider, makeStyles } from '@mui/styles';

export const useProfileStyles = makeStyles((theme) => ({
    root: {
        background: theme.background,
        border: 0,
        fontSize: 16,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    }
}))