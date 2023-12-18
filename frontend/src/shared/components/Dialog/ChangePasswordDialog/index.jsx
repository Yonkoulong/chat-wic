import React, { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import {
  StyledTextField,
  StyledLabelTextField,
  ControllerInput,
  SelectMultipleInput,
  ButtonCustomize,
  InputAdornment,
  IconButton
} from "@/shared/components";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

import { putUpdatePasswordMember } from "@/services/member.services";
import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { redirectTo } from "@/shared/utils/history";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from "./ChangePasswordDialog.styles";
import { useSocketStore } from "@/stores/SocketStore";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const defaultValues = {
    oldPassword: '',
    newPassword: ''
};

export const ChangePasswordDialog = ({ open, onClose }) => {
  const { fetchMembers, members } = useMemberStore((state) => state);
  const client = useSocketStore((state) => state.client);
  const { userInfo } = useAppStore((state) => state);

  const [membersSelected, setMembersSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputFocusRef = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;
    const field = useWatch({ control });

    if (field?.channelName && field?.userIds) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  const onSubmit = async (data) => {
    try {
      const newPayloadChannel = {
        ...data
      };

      const respData = await putUpdatePasswordMember(newPayloadChannel);

      if (respData) {
        const idChannel = respData?.data?.content?._id;
        setLoading(true);
        handleClose();
        // redirectTo(`/chat/channel/${idChannel}`);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      oldPassword: '',
      newPassword: ''
    });
    onClose(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Change password
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Current password <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Current password"
                fieldName="oldPassword"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter current password"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                New password <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="New password"
                fieldName="newPassword"
                required={true}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                        <IconButton aria-label="toggle password visibility">
                            <Visibility fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter new password"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
          </DialogContent>
          <DialogActions>
            <ButtonCustomize
              variant="outlined"
              autoFocus
              onClick={handleClose}
            >
              Cancel
            </ButtonCustomize>
            <ButtonCustomize
              variant="contained"
              type="submit"
              disabled={watchFieldsInModalCreateMember()}
            >
              Update
            </ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
