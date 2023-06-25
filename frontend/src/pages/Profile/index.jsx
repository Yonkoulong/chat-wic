import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    TextField,
    ControllerInput,
    ButtonCustomize,
    Select,
    MenuItem
} from "@/shared/components";
import { useProfileStyles } from './Profile.styles';
import { useAppStore } from '@/stores/AppStore';
import { useForm, useWatch } from "react-hook-form";

export const Profile = () => {
    const classes = useProfileStyles();
    const { userInfo } = useAppStore((state) => state);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const onSubmit = () => {
        //
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.leftProfile}>
                <Box className={classes.imgWrapper}>
                    <img src={`${userInfo?.avatar}`} alt="" className={classes.img} />
                </Box>
                <Typography className={classes.nameUser}>{userInfo?.username || ''}</Typography>
                <Box className={classes.buttonWrapper}>
                    <Button variant="contained" fullWidth>Edit profile</Button>
                    <Button variant="contained" fullWidth sx={{ marginTop: "16px" }} >Change password</Button>
                </Box>
            </Box>
            <Box className={classes.rightProfile}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box className={classes.formInfoWrapper}>
                        <Box className={classes.formRow}>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    EmployeeID
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?._id || "-"}
                                />
                            </Box>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    First Name <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.firstName || "-"}
                                />
                            </Box>
                        </Box>

                        <Box className={classes.formRow}>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Email <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.email || "-"}
                                />
                            </Box>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Last Name <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.lastName || "-"}
                                />
                            </Box>
                        </Box>

                        <Box className={classes.formRow}>
                            <Box className={classes.formItem}>
                                <Typography>
                                    Role <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.role || "-"}
                                />
                            </Box>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Date of Birth <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.dob || "-"}
                                />
                            </Box>
                        </Box>

                        <Box className={classes.formRow}>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Username <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.username || "-"}
                                    disabled
                                />
                            </Box>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Beginning Date <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.createdAt || "-"}
                                />
                            </Box>
                        </Box>

                        <Box className={classes.formRow}>
                            <Box className={classes.formItem}>
                                <Typography>
                                    Status <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.userStatus || "-"}
                                />
                            </Box>
                            <Box className={classes.formItem}>
                                <Typography props="disabled">
                                    Seniorty <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    disabled
                                    id="standard-input"
                                    variant="standard"
                                    fullWidth
                                    value={userInfo?.createdAt || "-"}
                                />
                            </Box>
                        </Box>
                    </Box>
                    {!isEditProfile ? <></> :
                        <Box className={classes.formButtonWrapper}>
                            <ButtonCustomize
                                variant="contained"
                                type="submit"
                            >
                                Update
                            </ButtonCustomize>
                            <ButtonCustomize variant="outlined">Cancel</ButtonCustomize>
                        </Box>
                    }
                </form>
            </Box>
        </Box>
    );
}