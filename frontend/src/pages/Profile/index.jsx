import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
  } from "@/shared/components";
import { useProfileStyles } from './Profile.styles';

export const Profile = () => {
    const classes = useProfileStyles();
    return (
        <Box>
            <Box className={classes.root}>
                <Box component="img"></Box>
                <Box>
                    <Typography>3455-Nguyễn Hải Long</Typography>
                    <Typography></Typography>
                    <Typography></Typography>
                    <Typography></Typography>
                </Box>
            </Box>
            <Box className={classes.root}></Box>
            <Box></Box>
        </Box>
    );
}