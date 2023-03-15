import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, TextareaAutosize, Typography } from "@/shared/components";
import {
  SymbolsAttachFileIcon,
  SymbolsImageOutlineIcon,
  StickerEmojiIcon,
  FluentTaskAddIcon,
} from "@/assets/icons";

import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
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
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const setHeightQuoteMessageBox = useChatStore(
    (state) => state.setHeightQuoteMessageBox
  );


  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [isPostMessage, setIsPostMessage] = useState(false);

  const textAreaRef = useRef(null);
  const quoteMessageRef = useRef(null);

  const handleChat = (e) => {
    if (e.target.value != "" && !hasWhiteSpace(e.target.value)) {
      if (!e.shiftKey && (e.key === "Enter" || e.keyCode === 13)) {
        postMessageOnServer(e.target.value, typesMessage.PLAIN_TEXT);
      }
    }

    //remove line break
    if (!e.shiftKey && (e.key === "Enter" || e.charCode === 13)) {
      e.preventDefault();
      const textArea = textAreaRef.current;
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

  const postMessageOnServer = async (value, type) => {
    try {
      const newPayloadMessage = {
        messageFrom: userInfo?._id,
        content: value,
        channelId: id,
        type: type,
        replyId : quoteMessage?._id || null
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
  }

  useEffect(() => {
    if (!isObjectEmpty(quoteMessage)) {
      const heightQuoteMessage = quoteMessageRef.current?.offsetHeight;
      setHeightQuoteMessageBox(heightQuoteMessage);
    }
  }, [quoteMessage]);

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
              You are answering {quoteMessage?.senderName}
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
          padding: "16px 24px",
          borderWidth: "2px",
          borderStyle: "solid none",
          borderColor: borderColor,
          backgroundColor: whiteColor,
        }}
      >
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px 0 0",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <StickerEmojiIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <SymbolsImageOutlineIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 10px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <SymbolsAttachFileIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <FluentTaskAddIcon />
        </Box>
      </Box>
      <Box>
        <Box sx={{ position: "relative" }}>
          <TextareaAutosize
            ref={textAreaRef}
            placeholder="Message"
            style={{
              width: "100%",
              maxHeight: "250px",
              padding: "16px 24px",
              display: "block",
              border: "none",
              outline: "none",
              fontSize: "18px",
              resize: "none",
            }}
            onChange={(e) => handleChatChange(e)}
            onKeyPress={(e) => handleChat(e)}
          />
          {isDisplayIconChat ? (
            <SendIcon
              sx={{
                position: "absolute",
                right: "55px",
                top: "50%",
                transform: "translateY(-50%)",
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </BoxMessageContainer>
  );
};
