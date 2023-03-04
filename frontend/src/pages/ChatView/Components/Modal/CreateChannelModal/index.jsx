import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";

import {
  StyledTextField,
  StyledLabelTextField,
  ControllerInput,
  Select,
  MenuItem,
  ButtonCustomize,
} from "@/shared/components";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { createMember } from "@/services/member.service";
import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { enumRoles } from "@/shared/utils/constant";
import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from "./CreateChannelModal.styles";


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

const roles = [
  {
    label: "Staff",
    value: enumRoles.STAFF,
  },
  {
    label: "Project Manager",
    value: enumRoles.PROJECT_MANAGER,
  },
];

const defaultValues = {
  email: "",
  password: "",
  role: "",
};

export const ModalCreateChannel = ({ open, onClose }) => {
  const { fetchMembers, setLoading } = useMemberStore((state) => state);
  const { userInfo } = useAppStore((state) => state);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  
  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;

    const field = useWatch({control});
    if(field?.email && field?.password && field?.role) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  }    

  const onSubmit = async (data) => {
    try {
      const respData = await createMember(data);

      if (respData) {
        setLoading(true);
        fetchMembers({
          organizeId: userInfo?.organizeId,
          id: "",
          email: "",
          paging: { page: 1, size: 10 },
        });
        toast.success("Create member successfully.");
        handleClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      email: "",
      password: "",
      role: "",
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
        Create member
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Email <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Email"
                fieldName="email"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="email"
                    placeholder="Enter email"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>

            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Password <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Password"
                fieldName="password"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="password"
                    placeholder="Enter password"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>

            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Role<span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Role"
                fieldName="role"
                required={true}
              >
                {(field) => (
                  <Select {...field} fullWidth size="small">
                    {roles.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <b>{option.label}</b>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
          </DialogContent>
          <DialogActions>
            <ButtonCustomize variant="outlined" autoFocus handleClick={handleClose}>
              Cancel
            </ButtonCustomize>
            <ButtonCustomize variant="contained" type="submit" disabled={watchFieldsInModalCreateMember()} >Create</ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
