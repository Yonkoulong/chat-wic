import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
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

import { postMessageDirect } from "@/services/direct.services";

import { uploadFile } from "@/services/attachment.services";

import { useAppStore } from "@/stores/AppStore";
import { useChatStore } from "@/stores/ChatStore";
import { useSocketStore } from "@/stores/SocketStore";
import { typesMessage, enumTypeRooms } from "@/shared/utils/constant";

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
  const { id } = useParams();

  const { userInfo } = useAppStore((state) => state);
  const { pushMessage, quoteMessage } = useChatStore((state) => state);

  const { client } = useSocketStore((state) => state);

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
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const respLinkImage = await uploadFile(selectedFile["type"], formData);

      if (!respLinkImage || !formFile?.typeRoom) {
        return;
      }

      if (formFile?.typeRoom === enumTypeRooms.CHANNEL) {
        let newPayloadMessageChannel = {
          messageFrom: userInfo?._id,
          content: respLinkImage?.data?.url || '',
          channelId: id,
          type: respLinkImage?.data?.resource_type,
          replyId: quoteMessage || null,
          senderName: userInfo?.username,
          senderAvatar: userInfo?.avatar
        };

        if (respLinkImage?.data?.resource_type == typesMessage.RAW) {
          newPayloadMessageChannel = {
            ...newPayloadMessageChannel,
            url: respLinkImage?.data?.url,
            secretUrl: respLinkImage?.data?.secure_url,
            fileName: respLinkImage?.data?.original_filename,
            size: respLinkImage?.data?.bytes,
          };
        }

        const respPostMessage = await postMessageChannel(
          newPayloadMessageChannel
        );

        if (respPostMessage) {
          client?.emit("send-message-channel", respPostMessage?.data);
          pushMessage(respPostMessage?.data);
          // fetchMessagesChannel({ channelId: id });
          handleClose();
        }
      }

      if (formFile?.typeRoom === enumTypeRooms.DIRECT) {
        let newPayloadMessageDirect = {
          messageFrom: userInfo?._id || '',
          content: respLinkImage?.data?.url || '',
          directId: id,
          type: respLinkImage?.data?.resource_type,
          replyId: quoteMessage || null,
          senderName: userInfo?.username,
          senderAvatar: userInfo?.avatar
        };

        if (respLinkImage?.data?.resource_type == typesMessage.RAW) {
          newPayloadMessageDirect = {
            ...newPayloadMessageDirect,
            url: respLinkImage?.data?.url,
            secretUrl: respLinkImage?.data?.secure_url,
            fileName: respLinkImage?.data?.original_filename,
            size: respLinkImage?.data?.bytes,
          };
        }

        const respPostMessage = await postMessageDirect(
          id,
          newPayloadMessageDirect
        );

        if (respPostMessage) {
          client?.emit("send-message-direct", respPostMessage?.data);
          pushMessage(respPostMessage?.data);
          // fetchMessagesDirect{});
          handleClose();
        }
      }
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
