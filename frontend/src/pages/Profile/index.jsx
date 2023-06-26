import React, { useState } from 'react';
import { useForm, useWatch } from "react-hook-form";
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
import { ChangePasswordDialog } from '@/shared/components/Dialog';



const initialValues = {
    dob: "",
    firstName: "",
    listName: "",                   
}

const passwordInitialValue = {
    oldPassword: "",
    newPassword: ""
}

const passwordVisible = {
    oldPassword: false,
    newPassword: false
}

export const Profile = () => {
    const classes = useProfileStyles();
    const { userInfo } = useAppStore((state) => state);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [valueForm, setValueForm] = useState(initialValues);
    const [passwordValues, setPasswordValues] = useState(passwordInitialValue);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const onSubmit = () => {
        //
    }

    const handleEditProfile = () => {
        setIsEditProfile(!isEditProfile);
    }

    const handleCancelEditProfile = () => {
        setIsEditProfile(false);
    }

    const handleUpdatePassword = () => {

    }

    return (
        <>
            <Box className={classes.container}>
                <Box className={classes.leftProfile}>
                    <Box className={classes.imgWrapper}>
                        <img src={`${userInfo?.avatar}`} alt="" className={classes.img} />
                    </Box>
                    <Typography className={classes.nameUser}>{userInfo?.username || ''}</Typography>
                    <Box className={classes.buttonWrapper}>
                        <Button variant="contained" fullWidth onClick={() => handleEditProfile()}>Edit profile</Button>
                        <Button variant="contained" fullWidth sx={{ marginTop: "16px" }} onClick={() => setOpenChangePasswordDialog(true)}>Change password</Button>
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
                                        First Name
                                    </Typography>
                                    <TextField
                                        disabled={!isEditProfile}
                                        id="standard-input"
                                        variant="standard"
                                        fullWidth
                                        name="firstName"
                                        value={userInfo?.firstName || "-"}
                                    />
                                </Box>
                            </Box>

                            <Box className={classes.formRow}>
                                <Box className={classes.formItem}>
                                    <Typography props="disabled">
                                        Email
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
                                        Last Name
                                    </Typography>
                                    <TextField
                                        disabled={!isEditProfile}
                                        id="standard-input"
                                        variant="standard"
                                        fullWidth
                                        name="lastName"
                                        value={userInfo?.lastName || "-"}
                                    />
                                </Box>
                            </Box>

                            <Box className={classes.formRow}>
                                <Box className={classes.formItem}>
                                    <Typography>
                                        Role
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
                                        Date of Birth
                                    </Typography>
                                    <TextField
                                        disabled={!isEditProfile}
                                        id="standard-input"
                                        variant="standard"
                                        name="dob"
                                        fullWidth
                                        value={userInfo?.dob || "-"}
                                    />
                                </Box>
                            </Box>

                            <Box className={classes.formRow}>
                                <Box className={classes.formItem}>
                                    <Typography props="disabled">
                                        Username
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
                                        Beginning Date
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
                                        Status
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
                                        Seniorty
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
                                    loading={false}
                                >
                                    Update
                                </ButtonCustomize>
                                <ButtonCustomize variant="outlined" onClick={() => handleCancelEditProfile()}>Cancel</ButtonCustomize>
                            </Box>
                        }
                    </form>
                </Box>
            </Box>
            <ChangePasswordDialog 
                open={openChangePasswordDialog}
                onClose={setOpenChangePasswordDialog}
            />
        </>
    );
}