import styled, { css } from "styled-components";
import { Box, Typography, Paper } from '@/shared/components';
import { blackColor, borderColor, whiteColor, hoverBackgroundColor, hoverItemSidebarColor, textColorItemSidebar, primaryColor } from '@/shared/utils/colors.utils';
import { device } from '@/shared/utils/breakpoints.utils';
import { ThemeProvider, makeStyles } from '@mui/styles';

export const useProfileStyles = makeStyles((theme) => ({
    container: {
        width: '80%',
        padding: '16px 24px',
        display: 'flex',
        maxWidth: '1170px',
        margin: 'auto',
        gap: '60px'
    },
    leftProfile: {

    },
    imgWrapper: {
        width: '296px',
        height: '296px',
        borderRadius: '100%',
        border: `1px solid`
    },
    img: {
        width: "100%",
        objectFit: 'contain',
        borderRadius: "100%"
    },
    nameUser: {
        marginTop: '24px'
    },
    buttonWrapper: {
        marginTop: "24px"
    },
    rightProfile: {
        width: '100%'
    },
    formInfoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '16px'
    },
    formRow: {
        display: 'flex',
        gap: '24px'
    },
    formItem: {
        width: '100%'
    },
    formButtonWrapper: {
        display: 'flex',
        gap: '16px',
        marginTop: '24px'
    },
    root: {
        [`${device.mobile}`]: {
            background: '#000'
        }
    }
}))