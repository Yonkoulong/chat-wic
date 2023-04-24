import React, { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

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

import { postChannel } from "@/services/channel.services";
import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { redirectTo } from "@/shared/utils/history";

import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from "./CreateChannelModal.styles";
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
  organizeId: "",
  channelName: "",
  description: "",
  ownerId: 0,
  userIds: [],
};

export const ModalCreateChannel = ({ open, onClose }) => {
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
        ...data,
        organizeId: userInfo?.organizeId,
        userIds: membersSelected?.map(mem => mem?.id),
        ownerId: userInfo?._id,
      };

      const respData = await postChannel(newPayloadChannel);

      if (respData) {
        const idChannel = respData?.data?.content?._id;
        client.emit('create-channel-room', respData?.data?.content)
        setLoading(true);
        handleClose();
        redirectTo(`/chat/channel/${idChannel}`);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      channelName: "",
      description: "",
      ownerId: 0,
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
        Create channel
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Channel name <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Channel name"
                fieldName="channelName"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter channel name"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>Description</StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Channel description"
                fieldName="description"
                required={false}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter channel description"
                    multiline
                    rows={4}
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                Members<span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="Members"
                fieldName="userIds"
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
              handleClick={handleClose}
            >
              Cancel
            </ButtonCustomize>
            <ButtonCustomize
              variant="contained"
              type="submit"
              disabled={watchFieldsInModalCreateMember()}
            >
              Create
            </ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
