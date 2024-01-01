import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ModalUploadFilePreview,
  ModalCreateTask,
} from "@/pages/ChatView/Components/Modal";
import {
  Box,
  TextareaAutosize,
  Typography,
  IconButton,
} from "@/shared/components";
import {
  SymbolsAttachFileIcon,
  SymbolsImageOutlineIcon,
  StickerEmojiIcon,
  FluentTaskAddIcon,
} from "@/assets/icons";

import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { useAppStore } from "@/stores/AppStore";
import { useRoomStore } from "@/stores/RoomStore";
import { useChatStore } from "@/stores/ChatStore";
import { useSocketStore } from "@/stores/SocketStore";
import { BoxMessageContainer } from "./BoxMessage.styles";
import {
  borderColor,
  primaryColor,
  whiteColor,
  hoverTextColor,
  inActiveColor,
  hoverBackgroundColor,
} from "@/shared/utils/colors.utils";
import {
  typesMessage,
  enumTypeRooms,
  enumRoles,
} from "@/shared/utils/constant";
import { hasWhiteSpace, isObjectEmpty, handleRenderMessageCustomWithType } from "@/shared/utils/utils";
import {
  postMessageChannel,
  putUpdateMessageChannel,
} from "@/services/channel.services";

import {
  putMessageDirect,
  postMessageDirect,
} from "@/services/direct.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const BoxMessage = () => {
  const { id } = useParams();

  const { typeRoom, roomInfo } = useRoomStore((state) => state);
  const userInfo = useAppStore((state) => state.userInfo);
  const { messages, pushMessage, editMessageStore } = useChatStore(
    (state) => state
  );
  const listQuoteMessageChannel = useChatStore((state) => state.listQuoteMessageChannel);
  const listQuoteMessageDirect = useChatStore((state) => state.listQuoteMessageDirect);
  const setDeleteQuoteMessageChannel = useChatStore((state) => state.setDeleteQuoteMessageChannel);
  const setDeleteQuoteMessageDirect = useChatStore((state) => state.setDeleteQuoteMessageDirect);
  const editMessage = useChatStore((state) => state.editMessage);
  const setEditMessage = useChatStore((state) => state.setEditMessage);
  const heightQuoteMessageBox = useChatStore((state) => state.heightQuoteMessageBox);
  const setHeightQuoteMessageBox = useChatStore(
    (state) => state.setHeightQuoteMessageBox
  );
  const { client } = useSocketStore((state) => state);

  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [openUploadFileModal, setOpenUpladFileModal] = useState(false);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [fileListObject, setFileListObject] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  // const [currentQuoteMessageState, setCurrentQuoteMessageState] = useState({});

  let currentQuoteMessage = {};

  const textAreaRef = useRef(null);
  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);
  // const quoteMessageRef = useRef(null);

  const handleChat = (e) => {
    const textArea = textAreaRef.current;

    if (e.target.value != "" && !hasWhiteSpace(e.target.value)) {
      if (!e.shiftKey && (e.key === "Enter" || e.keyCode === 13)) {        
        setIsDisplayIconChat(false);
        postMessageOnServer(e.target.value, typesMessage.PLAIN_TEXT);
        textArea.value = "";
        //has quoute message
        if (heightQuoteMessageBox && heightQuoteMessageBox > 0) {
          handleCancelQuoteMessage(currentQuoteMessage?._id);
        }

        if (editMessage) {
          setEditMessage(null);
        }
      }
    }

    //remove line break
    if (!e.shiftKey && (e.key === "Enter" || e.charCode === 13)) {
      e.preventDefault();
      textArea.value.replace("\n", "");
    }
  };

  const handleChatChange = (e) => {
    //Check show/hide send icon
    if (e.target.value != "" && !hasWhiteSpace(e.target.value)) {
      setIsDisplayIconChat(true);
    } else {
      setIsDisplayIconChat(false);
    }
  };

  const handleChangeValueImg = (e) => {
    const [file] = imgInputRef?.current?.files;

    if (file) {
      setFileListObject(file);
      setUploadFile({
        path: e.target.value,
        typeMessage: typesMessage.IMAGE,
        typeRoom,
      });
      setOpenUpladFileModal(true);
    }
  };

  const handleChangeValueFile = (e) => {
    const [file] = fileInputRef?.current?.files;
    if (file) {
      setFileListObject(file);
      setUploadFile({
        path: e.target.value,
        typeMessage: typesMessage.FILE,
        typeRoom,
      });
      setOpenUpladFileModal(true);
    }
  };

  const handleClickResetValue = (e) => {
    e.target.value = "";
  };

  const handleClickSendIcon = () => {};

  const postMessageOnServer = async (value, type) => {
    try {
      //Channel
      if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
        if (editMessage) {
          const newPayLoadEditMessageChannel = {
            content: value,
          };

          const resp = await putUpdateMessageChannel(
            editMessage?._id,
            newPayLoadEditMessageChannel
          );

          if (resp) {
            client.emit("edit-message-channel", resp?.data?.content);
            editMessageStore(resp?.data?.content);
          }
        } else {
          const newPayloadMessageChannel = {
            messageFrom: userInfo?._id,
            senderAvatar: userInfo?.avatar,
            senderName: userInfo?.username,
            content: value,
            channelId: id,
            type: type,
            replyId: listQuoteMessageChannel.find((quoteMessage) => quoteMessage?.channelId == id)?._id || null,
          };

          const resp = await postMessageChannel(newPayloadMessageChannel);
          if (resp) {
            client.emit("send-message-channel", resp?.data);
            pushMessage(resp?.data);
          }
        }
      }

      //Direct
      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        if (editMessage) {
          const newPayLoadEditMessageDirect = {
            content: value,
            reaction: {},
          };

          const resp = await putMessageDirect(
            editMessage?._id,
            newPayLoadEditMessageDirect
          );

          if (resp) {
            client.emit("edit-message-direct", resp?.data?.content);
            editMessageStore(resp?.data?.content);
          }
        } else {
          const newPayloadMessageDirect = {
            messageFrom: userInfo?._id,
            senderAvatar: userInfo?.avatar,
            senderName: userInfo?.username,
            content: value,
            type: type,
            replyId: listQuoteMessageDirect.find((quoteMessage) => quoteMessage?.directId == id)?._id || null,
          };

          const resp = await postMessageDirect(id, newPayloadMessageDirect);

          if (resp) {
            client.emit("send-message-direct", resp?.data);
            pushMessage(resp?.data);
          }
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.content;
      toast.error(errorMessage);
    }
  };

  const handleCancelQuoteMessage = (idQuoteMessage) => {
    if(typeRoom === enumTypeRooms.CHANNEL) {
      setDeleteQuoteMessageChannel(idQuoteMessage);
    } else {
      setDeleteQuoteMessageDirect(idQuoteMessage);
    }
    setHeightQuoteMessageBox(0);
  };

  const handleClickOpenModalCreateTask = () => {
    setOpenCreateTaskModal(true);
  };

  const handleRenderQuoteMessage = () => {
    if(typeRoom === enumTypeRooms.CHANNEL) {
      currentQuoteMessage = listQuoteMessageChannel?.find((quoteMessageChannel) => quoteMessageChannel.channelId === roomInfo?._id);
    } else {
      currentQuoteMessage = listQuoteMessageDirect?.find((quoteMessageDirect) => quoteMessageDirect.directId === roomInfo?._id);
    }
    
    if(currentQuoteMessage) {
      
      return (
        <Box
        ref={quoteMessageRef}
        sx={{
          backgroundColor: hoverTextColor,
          padding: "8px 24px",
        }}
      >
        <Box sx={{ ...flexCenter, justifyContent: "space-between" }}>
          <Typography variant="subtitle2">
            You are answering {userInfo?.username == currentQuoteMessage?.senderName
              ? "yourself"
              : currentQuoteMessage?.senderName}
          </Typography>
          <CloseIcon
            sx={{
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "50px",

              ":hover": {
                backgroundColor: hoverBackgroundColor,
                color: primaryColor,
              },
            }}
            onClick={() => handleCancelQuoteMessage(currentQuoteMessage?._id)}
          />
        </Box>
        <Box mt={1}>
          <Box sx={{ color: inActiveColor }}>
            {handleRenderMessageCustomWithType(currentQuoteMessage)}
          </Box>
        </Box>
      </Box>
      )
    } else {
      return (<></>)
    }
  }

  useEffect(() => {
    if (editMessage) {
      switch (editMessage?.type) {
        case typesMessage.PLAIN_TEXT:
          {
            textAreaRef.current.value = editMessage?.content;
            setTimeout(() => {
              textAreaRef.current.focus();
            }, 100);

            if (
              textAreaRef.current.value != "" &&
              !hasWhiteSpace(textAreaRef.current.value)
            ) {
              setIsDisplayIconChat(true);
            }
          }
          break;
        case typesMessage.IMAGE:
          {
          }
          break;
        case typesMessage.FILE:
          {
          }
          break;
      }
    }
  }, [editMessage]);

  const quoteMessageRef = useCallback((node) => {
    if(node !== null) {
      
      if (listQuoteMessageChannel.length > 0 || listQuoteMessageDirect.length > 0 ) {
        let isQuoteMessaging = false;
       
        if(typeRoom === enumTypeRooms.CHANNEL) {
          isQuoteMessaging = listQuoteMessageChannel?.some((quoteMessageChannel) => quoteMessageChannel.channelId === id);
        } else {
          isQuoteMessaging = listQuoteMessageDirect?.some((quoteMessageDirect) => quoteMessageDirect.directId === roomInfo?._id);
        }
  
        if(isQuoteMessaging) {
          const heightQuoteMessage = node?.offsetHeight || 0;
          setHeightQuoteMessageBox(heightQuoteMessage);
  
          setTimeout(() => {
            textAreaRef.current.focus();
          }, 100);
        } else {
          setHeightQuoteMessageBox(0);
        }
      }
    }
  }, [id, listQuoteMessageChannel, listQuoteMessageDirect]) //check when change room

  return (
    <BoxMessageContainer>
      {handleRenderQuoteMessage()}
      <Box
        sx={{
          ...flexCenter,
          padding: "8px 24px",
          borderWidth: "2px",
          borderStyle: "solid none",
          borderColor: borderColor,
          backgroundColor: whiteColor,
        }}
      >
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            ...flexCenter,
            mr: 1,
          }}
        >
          <StickerEmojiIcon />
        </IconButton>

        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            ...flexCenter,
            mx: 1,
          }}
          onClick={handleClickResetValue}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleChangeValueImg}
            ref={imgInputRef}
          />
          <SymbolsImageOutlineIcon />
        </IconButton>

        <IconButton
          color="primary"
          aria-label="upload file"
          component="label"
          sx={{
            ...flexCenter,
            mx: 1,
          }}
          onClick={handleClickResetValue}
        >
          <input
            hidden
            accept="*/"
            type="file"
            onChange={handleChangeValueFile}
            ref={fileInputRef}
          />
          <SymbolsAttachFileIcon />
        </IconButton>

        {userInfo.role == enumRoles.PROJECT_MANAGER &&
        typeRoom == enumTypeRooms.CHANNEL ? (
          <IconButton
            color="primary"
            aria-label="todo list"
            component="label"
            sx={{
              ...flexCenter,
              mx: 1,
            }}
            onClick={handleClickOpenModalCreateTask}
          >
            <FluentTaskAddIcon />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
      <Box>
        <Box sx={{ position: "relative" }}>
          <TextareaAutosize
            ref={textAreaRef}
            placeholder="Message"
            style={{
              width: "100%",
              maxHeight: "250px",
              padding: "16px 58px 16px 24px",
              display: "block",
              border: "none",
              outline: "none",
              fontSize: "15px",
              resize: "none",
            }}
            onChange={(e) => handleChatChange(e)}
            onKeyPress={(e) => handleChat(e)}
          />
          <Box
            sx={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              ":hover": {
                color: primaryColor,
                cursor: "pointer",
              },
            }}
          >
            {isDisplayIconChat ? (
              <SendIcon onClick={handleClickSendIcon} />
            ) : (
              <ThumbUpIcon />
            )}
          </Box>
        </Box>
      </Box>
      {/* Modal */}
      <ModalUploadFilePreview
        open={openUploadFileModal}
        onClose={setOpenUpladFileModal}
        data={fileListObject}
        formFile={uploadFile}
      />

      <ModalCreateTask
        open={openCreateTaskModal}
        onClose={setOpenCreateTaskModal}
      />
    </BoxMessageContainer>
  );
};
