import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

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
import { typesMessage } from "@/shared/utils/constant";
import { hasWhiteSpace, isObjectEmpty } from "@/shared/utils/utils";
import {
  postMessageChannel,
  getMessageChannelByChannelId,
} from "@/services/channel.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const BoxMessage = () => {
  const { id } = useParams();
  const userInfo = useAppStore((state) => state.userInfo);
  const setMessages = useChatStore((state) => state.setMessages);
  const quoteMessage = useChatStore((state) => state.quoteMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const setEditMessage = useChatStore((state) => state.setEditMessage);
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const setHeightQuoteMessageBox = useChatStore(
    (state) => state.setHeightQuoteMessageBox
  );

  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [isPostMessage, setIsPostMessage] = useState(false);

  const textAreaRef = useRef(null);
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

  const handleClickSendIcon = () => {};

  const postMessageOnServer = async (value, type) => {
    try {
      const newPayloadMessage = {
        messageFrom: userInfo?._id,
        content: value,
        channelId: id,
        type: type,
        replyId: quoteMessage?._id || null,
      };
      const resp = await postMessageChannel(newPayloadMessage);
      if (resp) {
        const messageResp = await getMessageChannelByChannelId({
          channelId: id,
        });
        setMessages(messageResp?.data?.content);
      }
    } catch (error) {
      const errorMessage = error?.response?.content;
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
    }

    if(!isObjectEmpty(editMessage)) {
      switch(editMessage?.type) {
        case typesMessage.PLAIN_TEXT: {
          textAreaRef.current.value = editMessage?.content; 
        }
        break;
        case typesMessage.IMAGE: {

        }
        break;
        case typesMessage.FILE: {

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
              You are answering {" "}
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
          <input hidden accept="image/*" type="file" />
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
            accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            type="file"
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
    </BoxMessageContainer>
  );
};
