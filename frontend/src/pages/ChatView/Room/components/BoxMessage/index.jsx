import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ModalUploadFilePreview } from "@/pages/ChatView/Components/Modal";
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
import { BoxMessageContainer } from "./BoxMessage.styles";
import {
  borderColor,
  primaryColor,
  whiteColor,
  hoverTextColor,
  inActiveColor,
  hoverBackgroundColor,
} from "@/shared/utils/colors.utils";
import { typesMessage, enumTypeRooms } from "@/shared/utils/constant";
import { hasWhiteSpace, isObjectEmpty } from "@/shared/utils/utils";
import {
  postMessageChannel,
  putUpdateMessageChannel,
} from "@/services/channel.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const BoxMessage = () => {
  const { id } = useParams();

  const typeRoom = useRoomStore((state) => state.typeRoom);
  const userInfo = useAppStore((state) => state.userInfo);
  const quoteMessage = useChatStore((state) => state.quoteMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const setEditMessage = useChatStore((state) => state.setEditMessage);
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const setHeightQuoteMessageBox = useChatStore(
    (state) => state.setHeightQuoteMessageBox
  );
  const fetchMessagesChannel = useChatStore(
    (state) => state.fetchMessagesChannel
  );
  const fetchMessagesDirect = useChatStore(
    (state) => state.fetchMessagesDirect
  );
  
  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [openUploadFileModal, setOpenUpladFileModal] = useState(false);
  const [fileListObject, setFileListObject] = useState([]);
  const [uploadFile, setUploadFile] = useState({});

  const textAreaRef = useRef(null);
  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const quoteMessageRef = useRef(null);

  const handleChat = (e) => {
    const textArea = textAreaRef.current;

    if (e.target.value != "" && !hasWhiteSpace(e.target.value)) {
      if (!e.shiftKey && (e.key === "Enter" || e.keyCode === 13)) {
        postMessageOnServer(e.target.value, typesMessage.PLAIN_TEXT);
        textArea.value = "";
        setIsDisplayIconChat(false);

        //has quoute message
        if (!isObjectEmpty(quoteMessage)) {
          handleCancelQuoteMessage();
        }

        if (!isObjectEmpty(editMessage)) {
          setEditMessage({});
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
      setUploadFile({ path: e.target.value, typeMessage: typesMessage.IMAGE, typeRoom })
      setOpenUpladFileModal(true);
    }
  };

  const handleChangeValueFile = (e) => {
    const [file] = fileInputRef?.current?.files;
    if (file) {
      setFileListObject(file);
      setUploadFile({ path: e.target.value, typeMessage: typesMessage.FILE, typeRoom })
      setOpenUpladFileModal(true);
    }
  }

  const handleClickResetValue= (e) => {
    e.target.value = "";
  };

  const handleClickSendIcon = () => {};

  const postMessageOnServer = async (value, type) => {
    try {
      //Channel
      if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
        if (!isObjectEmpty(editMessage)) {
          const newPayLoadEditMessageChannel = {
            ...editMessage,
            content: value,
            replyMessage: quoteMessage,
          };

          const resp = await putUpdateMessageChannel(
            id,
            newPayLoadEditMessageChannel
          );

          if (resp) {
            fetchMessagesChannel({ channelId: id });
          }
        } else {
          const newPayloadMessageChannel = {
            messageFrom: userInfo?._id,
            content: value,
            channelId: id,
            type: type,
            replyId: quoteMessage?._id || null,
          };

          const resp = await postMessageChannel(newPayloadMessageChannel);

          if (resp) {
            fetchMessagesChannel({ channelId: id });
          }
        }
      }

      //Direct
      if (typeInfo && typeInfo === enumTypeRooms.DIRECT) {
        fetchMessagesDirect({ directId: id });
      }
    } catch (error) {
      const errorMessage = error?.response?.content;
      toast.error(errorMessage);
    }
  };

  const handleCancelQuoteMessage = () => {
    setQuoteMessage({});
    setHeightQuoteMessageBox(0);
  };

  useEffect(() => {
    if (!isObjectEmpty(quoteMessage)) {
      const heightQuoteMessage = quoteMessageRef.current?.offsetHeight;
      setHeightQuoteMessageBox(heightQuoteMessage);

      setTimeout(() => {
        textAreaRef.current.focus();
      }, 100);
    }

    if (!isObjectEmpty(editMessage)) {
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
  }, [quoteMessage, editMessage]);

  return (
    <BoxMessageContainer>
      {!isObjectEmpty(quoteMessage) ? (
        <Box
          ref={quoteMessageRef}
          sx={{
            backgroundColor: hoverTextColor,
            padding: "8px 24px",
          }}
        >
          <Box sx={{ ...flexCenter, justifyContent: "space-between" }}>
            <Typography variant="subtitle2">
              You are answering{" "}
              {userInfo?.username == quoteMessage?.senderName
                ? "yourself"
                : quoteMessage?.senderName}
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
              onClick={handleCancelQuoteMessage}
            />
          </Box>
          <Box mt={1}>
            <Typography component="p" sx={{ color: inActiveColor }}>
              {quoteMessage?.content}
            </Typography>
          </Box>
        </Box>
      ) : (
        <></>
      )}

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
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleChangeValueImg}
            onClick={handleClickResetValue}
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
        >
          <input
            hidden
            accept="*/"
            type="file"
            onChange={handleChangeValueFile}
            onClick={handleClickResetValue}
            ref={fileInputRef}
          />
          <SymbolsAttachFileIcon />
        </IconButton>

        <IconButton
          color="primary"
          aria-label="todo list"
          component="label"
          sx={{
            ...flexCenter,
            mx: 1,
          }}
        >
          <FluentTaskAddIcon />
        </IconButton>
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
    </BoxMessageContainer>
  );
};
