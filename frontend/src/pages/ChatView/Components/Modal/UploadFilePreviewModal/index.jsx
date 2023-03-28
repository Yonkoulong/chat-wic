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
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Dialog, IconButton, Typography } from "@/shared/components";

import CloseIcon from "@mui/icons-material/Close";

import {
  postMessageChannel,
  putUpdateMessageChannel,
} from "@/services/channel.services";

import { uploadFile } from "@/services/attachment.services";

import { useMemberStore } from "@/stores/MemberStore";
import { useAppStore } from "@/stores/AppStore";
import { redirectTo } from "@/shared/utils/history";
import { typesMessage } from "@/shared/utils/constant";

import {
  CreateMemberFormWrapper,
  CreateMemberForm,
  CreateMemberInputContainer,
  // CreateMemberFeatureWrapper,
} from "./UploadFilePreviewModal.styles";

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
  fileName: "",
  description: "",
  filePath: "",
};

export const ModalUploadFilePreview = ({ open, onClose, data, formFile }) => {
  const { fetchMembers, members } = useMemberStore((state) => state);
  const { userInfo } = useAppStore((state) => state);

  const [membersSelected, setMembersSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sizeFile, setSizeFile] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const watchFieldsInModalCreateMember = () => {
    let isEnable = false;
    const field = useWatch({ control });

    if (field?.fileName) {
      isEnable = false;
    } else {
      isEnable = true;
    }
    return isEnable;
  };

  const onSubmit = async (data) => {
    try {
      
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

      console.log(formData.getAll('file'));
      console.log(formData.getAll('upload_preset'));

      const respLinkImage = await uploadFile(selectedFile['type'], formData);
      if(!respLinkImage) { return; }

      // const newPayloadChannel = {
      //   ...data,
      //   userIds: membersSelected?.map((mem) => mem?.id),
      //   ownerId: userInfo?._id,
      // };

      // const respData = await postMessageChannel(newPayloadChannel);

      
        // const idChannel = respData?.data?.content?._id;
        // setLoading(true);
        // toast.success("Create channel successfully.");
        // handleClose();
        // redirectTo(`/chat/channel/${idChannel}`);
      
    } catch (error) {
      const errorMessage = error?.response?.data?.content || error?.message;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset({
      fileName: "",
      description: "",
    });
    onClose(false);
  };

  useEffect(() => {
    if (data) {
      setSelectedFile(data);
      setValue("fileName", data["name"]);

      //set size file
      let newSize = Math.round((data.size / 1024) * 100) / 100;
      setSizeFile(newSize);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedFile || selectedFile.length <= 0) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        File Upload
      </BootstrapDialogTitle>
      <CreateMemberFormWrapper>
        <CreateMemberForm onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Box mb={1}>
              {formFile && formFile.typeMessage == typesMessage.IMAGE ? (
                <Box sx={{ display: "flex" }}>
                  {preview && (
                    <img
                      src={preview}
                      alt="img"
                      style={{
                        width: "300px",
                        objectFit: "cover",
                        margin: "0 auto",
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Box>
                  {data && (
                    <Typography fontSize="large" fontWeight="bold">
                      {data["name"]} - {sizeFile} KB
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            <CreateMemberInputContainer>
              <StyledLabelTextField>
                File name <span className="require-field">*</span>
              </StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="File name"
                fieldName="fileName"
                required={true}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter file name"
                  />
                )}
              </ControllerInput>
            </CreateMemberInputContainer>
            <CreateMemberInputContainer>
              <StyledLabelTextField>Description</StyledLabelTextField>
              <ControllerInput
                control={control}
                errors={errors}
                fieldNameErrorMessage="File description"
                fieldName="description"
                required={false}
              >
                {(field) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter file description"
                    multiline
                    rows={4}
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
              Send
            </ButtonCustomize>
          </DialogActions>
        </CreateMemberForm>
      </CreateMemberFormWrapper>
    </BootstrapDialog>
  );
};
