import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";

import {
  StyledTextField,
  StyledLabelTextField,
  ControllerInput,
  SelectMultipleInput,
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

import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { useSocketStore } from "@/stores/SocketStore";
import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from "./AddUserModal.styles";
import { redirectTo } from "@/shared/utils/history";

import { postAddMembersToChannel } from '@/services/channel.services';

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
  ids: [],
};

export const ModalAddUser = ({ open, onClose }) => {
  const { fetchMembers, members } = useMemberStore((state) => state);
  const { userInfo } = useAppStore((state) => state);
  const client = useSocketStore((state) => state.client);

  const [membersSelected, setMembersSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputFocusRef = useRef();
  const { id } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;

    const field = useWatch({ control });
    if (field?.ids) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  const onSubmit = async (data) => {
    const newListMemberIds = membersSelected?.map((mem) => mem?._id);
    try {
      const newPayloadMembers = {       
        ids: [...data.ids, ...newListMemberIds]
      };
      const respData = await postAddMembersToChannel(id, newPayloadMembers);

      if (respData) {
        const idChannel = respData?.data?.content?._id;
        client.emit('create-channel-room', respData?.data?.content)
        setLoading(true);
        handleClose();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      userIds: [],
    });
    onClose(false);
  };

  const handleGetUsers = async () => {
    setLoading(true);
    try {
      await fetchMembers({
        organizeId: userInfo?.organizeId,
        id: "",
        email: "",
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      handleFocusInputAfterClick();
    }
  };

  const handleSelectedMember = (member) => {
    if (!member) return;
    const memberId = member?.id;
    const membersSelectedIds = membersSelected?.map((mem) => mem?.id);
    const inputRef = inputFocusRef.current.querySelector("input");

    let newMembersSelected = [];
    if (membersSelectedIds?.includes(memberId)) {
      newMembersSelected = membersSelected?.filter(
        (member) => member?.id !== memberId
      );
    } else {
      newMembersSelected = [...membersSelected, member];
    }

    if (inputRef.value != "") {
      inputRef.value = "";
      handleGetUsers();
    }

    setMembersSelected(newMembersSelected);
    handleFocusInputAfterClick();
  };

  const handleUnSelectedMember = (member) => {
    if (!member) return;
    const newMembersUnSelected = membersSelected?.filter(
      (memberSelected) => memberSelected?.id !== member?.id
    );
    setMembersSelected(newMembersUnSelected);
    handleFocusInputAfterClick();
  };

  const handleSearchMember = async (e) => {
    setLoading(true);
    try {
      await fetchMembers({
        organizeId: userInfo?.organizeId,
        id: "",
        email: e.target.value,
        paging: { page: 1, size: 10 },
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFocusInputAfterClick = () => {
    const inputRef = inputFocusRef.current;
    inputRef.querySelector("input").focus();
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add members
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Members<span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Members"
                fieldName="ids"
                required={false}
              >
                {(field) => (
                  <SelectMultipleInput
                    {...field}
                    inputFocusRef={inputFocusRef}
                    handleSearch={handleSearchMember}
                    onOpenDropdown={handleGetUsers}
                    handleSelectedMember={handleSelectedMember}
                    handleUnSelectedMember={handleUnSelectedMember}
                    dataList={members}
                    dataSelected={membersSelected}
                    loading={loading}
                    placeholder="Add member"
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
              Add
            </ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
