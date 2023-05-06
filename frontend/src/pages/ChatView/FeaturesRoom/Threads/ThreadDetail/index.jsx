import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import EmojiPicker from "emoji-picker-react";

import {
  Box,
  Typography,
  IconButton,
  TruncateString,
  TextareaAutosize,
  Paper,
} from "@/shared/components";
import { RoomNotFound } from "@/shared/components/RoomNotFound";

import Popover from "@mui/material/Popover";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  SymbolsAttachFileIcon,
  SymbolsImageOutlineIcon,
  LucideQuoteIcon,
  SymbolsAddReactionOutlineIcon,
  StickerEmojiIcon,
  UilCommentMessageIcon,
} from "@/assets/icons";

import {
  RoomContentContainer,
  BoxMessageContainer,
  MessageList,
  MessageItem,
  UserImageWrapper,
  UserImage,
  MessageContentWrapper,
  MessageTitle,
  UserName,
  TimeMessage,
  MessageContentBox,
  InteractMessageWrapper,
  MessageReplyContent,
  MessageQuoteBox,
  MessageReactionBox,
  MessageThreadBox,
} from "./ThreadDetail.styles";

import {
  ModalUploadFilePreview,
  ModalCreateTask,
} from "@/pages/ChatView/Components/Modal";

import {
  blackColor,
  whiteColor,
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";

import { redirectTo } from "@/shared/utils/history";
import { chatTimestamp } from "@/shared/utils/utils";
import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";
import { useChatStore } from "@/stores/ChatStore";
import { useSocketStore } from "@/stores/SocketStore";
import { useThreadStore } from "@/stores/ThreadStore";

import {
  typesMessage,
  enumTypeRooms,
  enumRoles,
} from "@/shared/utils/constant";
import { hasWhiteSpace, isObjectEmpty } from "@/shared/utils/utils";
import {
  postMessageChannel,
  putUpdateMessageChannel,
  getMessageChannelDetail,
} from "@/services/channel.services";

import {
  putMessageDirect,
  postMessageDirect,
} from "@/services/direct.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const ThreadDetail = () => {
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const userInfo = useAppStore((state) => state.userInfo);
  const {
    messagesThread,
    pushThreadMessage,
    deleteThreadMessage,
    editThreadMessageStore,
    reactionThreadMessage,
    fetchMessagesThreadChannel,
    quoteThreadMessage,
    editThreadMessage,
    setQuoteThreadMessage,
    heightQuoteThreadMessageBox,
    setHeightQuoteThreadMessageBox,
    setEditThreadMessage,
    loading,
    setLoading,
    selectedThreadMessage,
    setSelectedThreadMessage,
  } = useThreadStore((state) => state);
  const { client } = useSocketStore((state) => state);

  const [idMessageHovering, setIdMessageHovering] = useState(null);
  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [openUploadFileModal, setOpenUpladFileModal] = useState(false);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [fileListObject, setFileListObject] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  const [anchorReaction, setAnchorReaction] = useState(null);
  const [anchorMoreFeatureMessage, setAnchorMoreFeatureMessage] =
    useState(null);

  const textAreaRef = useRef(null);
  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const quoteMessageRef = useRef(null);
  const scrollRef = useRef(null);

  const { id, threadId } = useParams();

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
        if (!isObjectEmpty(editMessage)) {
          const newPayLoadEditMessageChannel = {
            content: value,
          };

          const resp = await putUpdateMessageChannel(
            editMessage?._id,
            newPayLoadEditMessageChannel
          );

          if (resp) {
            fetchMessagesChannel({ channelId: id });
          }
        } else {
          const newPayloadMessageChannel = {
            messageFrom: userInfo?._id,
            senderName: userInfo?.username,
            content: value,
            channelId: id,
            type: type,
            replyId: quoteMessage?._id || null,
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
        if (!isObjectEmpty(editMessage)) {
          const newPayLoadEditMessageDirect = {
            content: value,
            reaction: {},
          };

          const resp = await putMessageDirect(
            editMessage?._id,
            newPayLoadEditMessageDirect
          );

          if (resp) {
            fetchMessagesDirect({ directId: id });
          }
        } else {
          const newPayloadMessageDirect = {
            messageFrom: userInfo?._id,
            content: value,
            type: type,
            replyId: quoteMessage?._id || null,
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

  const handleCancelQuoteMessage = () => {
    setQuoteMessage({});
    setHeightQuoteMessage(0);
  };

  const handleMouseOver = (message) => {
    setIdMessageHovering(message?._id);
  };

  const handleMouseOut = () => {
    setIdMessageHovering(null);
  };

  const handleClickEmoji = async (emoji) => {
    const { names, unified } = emoji;

    try {
      const newPayload = {
        content: "",
        reaction: {
          emojiName: names[0],
          unified: `0x${unified}`,
          reactorName: userInfo?.username,
          reactorId: userInfo?._id,
          idReaction: userInfo?._id,
        },
      };

      if (!idEditMessage) return;

      if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
        const resp = await putUpdateMessageChannel(idEditMessage, newPayload);

        if (resp) {
          fetchMessagesChannel({ channelId: roomInfo?._id });
        }
      }

      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        const resp = await putMessageDirect(idEditMessage, newPayload);

        if (resp) {
          fetchMessagesDirect({ directId: roomInfo?._id });
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    } finally {
      setAnchorReaction(null);
    }
  };

  const countNumberReactionPerMemoji = () => {};

  //reply
  const handleClickReplyMessage = (message) => {
    if (message) {
      setQuoteMessage(message);
    }
  };

  //handle open anchor
  const handleClickOpenAnchorReaction = (event, messageId) => {
    setAnchorReaction(event.currentTarget);
    setIdEidtMessage(messageId);
  };

  const handClickOpenAnchorMoreFeatureMessage = (event) => {
    setAnchorMoreFeatureMessage(event.currentTarget);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
        const resp = await deleteMessageChannel(messageId);

        if (resp) {
          fetchMessagesChannel({ channelId: roomInfo?._id });
        }
      }

      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        const resp = await deleteMessageDirect(messageId);

        if (resp) {
          fetchMessagesDirect({ directId: roomInfo?._id });
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    } finally {
      setAnchorMoreFeatureMessage(null);
    }
  };

  const handleClickUpdateMessage = (message) => {
    if (message) {
      if (message?.replyId) {
        setQuoteMessage(message?.replyMessage);
      }
      setEditMessage(message);
      setAnchorMoreFeatureMessage(null);
    }
  };

  //close anchor
  const handleCloseAnchorReaction = () => {
    setAnchorReaction(null);
  };

  const handleCloseAnchorMoreFeatureMessage = () => {
    setAnchorMoreFeatureMessage(null);
  };

  //handle render message with type
  const handleRenderMessageWithType = (message) => {
    switch (message?.type) {
      case typesMessage.PLAIN_TEXT: {
        return renderMessageWithTypePlainText(message);
      }

      case typesMessage.IMAGE: {
        return renderMessageWithTypeImage(message);
      }

      case typesMessage.RAW: {
        return renderMessageWithTypeRaw(message);
      }

      case typesMessage.VIDEO: {
        return renderMessageWithTypeVideo(message);
      }
    }
  };

  const renderMessageWithTypePlainText = (message) => {
    return handleDetectUrl(message?.content);
  };

  const renderMessageWithTypeImage = (message) => {
    return (
      <Paper sx={{ width: "360px", height: "360px", marginTop: 1 }}>
        <img
          src={message?.content}
          alt="image-message"
          style={{ width: "100%", objectFit: "contain" }}
        />
      </Paper>
    );
  };

  const renderMessageWithTypeRaw = (message) => {
    return (
      <Box
        component="a"
        href={message?.content}
        download
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: "10px",
          backgroundColor: hoverTextColor,
          width: "max-content",
          padding: "4px 8px",
          marginTop: 1,
        }}
      >
        <Box
          sx={{
            width: "34px",
            height: "34px",
            backgroundColor: primaryColor,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DescriptionIcon sx={{ color: whiteColor }} />
        </Box>
        <Typography ml={1} sx={{ color: blackColor }}>
          filename.path
        </Typography>
      </Box>
    );
  };

  const renderMessageWithTypeVideo = (message) => {
    return (
      <Paper sx={{ width: "fit-content", marginTop: 1 }}>
        <video
          width="320"
          height="100%"
          style={{ borderRadius: "4px" }}
          controls
        >
          <source src={message?.content} type="video/mp4" />
        </video>
      </Paper>
    );
  };

  const handleDetectUrl = (content) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(content)) {
      const newUrl = content.replace(urlRegex, function (url) {
        return url;
      });

      return (
        <Box component="a" href={newUrl} target="_blank">
          {newUrl}
        </Box>
      );
    } else {
      return <Typography fontSize="small">{content}</Typography>;
    }
  };

  useEffect(() => {
    if (threadId) {
      try {
        const respMessageChannel = getMessageChannelDetail({ messageId: threadId });
        const respMessageThreadChannel = fetchMessagesThreadChannel(threadId);
        if (!respMessageChannel || !respMessageThreadChannel) { return; }

        setSelectedThreadMessage(respMessageChannel?.response?.content);
        
      } catch (error) {
        throw error;
      }
    }
  }, [threadId]);

  //open anchor
  const openAnchorReaction = Boolean(anchorReaction);
  const openAnchorMoreFeatureMessage = Boolean(anchorMoreFeatureMessage);

  //id anchor
  const idAnchorReaction = openAnchorReaction
    ? "anchor-reaction-popover"
    : undefined;
  const idAnchorMoreFeatureMessage = openAnchorMoreFeatureMessage
    ? "anchor-more-feature-message"
    : undefined;

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box
        sx={{
          ...flexCenter,
          justifyContent: "space-between",
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <IconButton
            onClick={() => redirectTo(`/chat/channel/${id}/threads`)}
            color="primary"
          >
            <KeyboardReturnIcon />
          </IconButton>
          <Typography ml={0.5} fontWeight="bold" noWrap sx={{ width: "200px" }}>
            {selectedThreadMessage &&
              handleRenderMessageWithType(selectedThreadMessage)}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          component="label"
          sx={{
            ":hover": {
              color: primaryColor,
            },
          }}
          onClick={() => handleClickCloseThread()}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Box content */}
      <RoomContentContainer>
        <Box>
          <Box
            sx={{
              padding: "24px 0px",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: `calc(100vh - 262.8px - ${heightQuoteMessage || 0}px)`,
            }}
          >
            <MessageList>
              {!loading &&
                messages &&
                messages?.map((message, index) => {
                  return (
                    <MessageItem
                      onMouseOver={() => handleMouseOver(message)}
                      onMouseOut={handleMouseOut}
                      key={message?._id || index}
                      ref={scrollRef}
                      sx={{
                        backgroundColor:
                          editMessage?._id === message?._id
                            ? hoverTextColor
                            : "",
                      }}
                    >
                      {message?.avatar ? (
                        <UserImageWrapper>
                          <UserImage src={message?.avatar || ""} alt="image" />
                        </UserImageWrapper>
                      ) : (
                        <AccountCircleIcon
                          sx={{ width: "40px", height: "40px" }}
                        />
                      )}

                      {idMessageHovering === message?._id ? (
                        <InteractMessageWrapper>
                          <Box
                            sx={{
                              ...flexCenter,
                              padding: "8px 4px",
                            }}
                          >
                            <Box
                              sx={{
                                m: "0 8px",
                                ...flexCenter,
                              }}
                            >
                              <LucideQuoteIcon
                                onClick={() => handleClickReplyMessage(message)}
                              />
                            </Box>
                            <Box
                              sx={{
                                m: "0 8px",
                                ...flexCenter,
                              }}
                            >
                              <SymbolsAddReactionOutlineIcon
                                onClick={(e) =>
                                  handleClickOpenAnchorReaction(e, message?._id)
                                }
                              />
                              <Popover
                                id={idAnchorReaction}
                                anchorEl={anchorReaction}
                                open={openAnchorReaction}
                                onClose={handleCloseAnchorReaction}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                                sx={{
                                  "& .MuiPaper-root": {
                                    borderRadius: "10px",
                                  },
                                }}
                              >
                                <Box>
                                  <EmojiPicker
                                    width={250}
                                    height={400}
                                    onEmojiClick={(e) => handleClickEmoji(e)}
                                  />
                                  {/* <Picker 
                                  data={data}
                                  onEmojiSelect={(e) => handleClickEmoji(e)}
                                /> */}
                                </Box>
                              </Popover>
                            </Box>
                            <Box
                              sx={{
                                m: "0 8px",
                                ...flexCenter,
                              }}
                            >
                              <UilCommentMessageIcon
                                width="0.7em"
                                height="0.7em"
                              />
                            </Box>
                            <Box
                              sx={{
                                m: "0 8px 0 0",
                                ...flexCenter,
                                ":hover": {
                                  color: primaryColor,
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <MoreVertIcon
                                sx={{ fontSize: "20px" }}
                                onClick={handClickOpenAnchorMoreFeatureMessage}
                              />
                              <Popover
                                id={idAnchorMoreFeatureMessage}
                                anchorEl={anchorMoreFeatureMessage}
                                open={openAnchorMoreFeatureMessage}
                                onClose={handleCloseAnchorMoreFeatureMessage}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                sx={{
                                  "& .MuiPaper-root": {
                                    borderRadius: "10px",
                                    margin: "11px 0px 0 0",
                                    width: "120px",
                                  },
                                }}
                              >
                                <Box>
                                  {userInfo?._id === message?.messageFrom && (
                                    <>
                                      <Typography
                                        sx={{
                                          padding: "8px",
                                          fontSize: "14px",
                                          ":hover": {
                                            color: primaryColor,
                                            opacity: 0.8,
                                            cursor: "pointer",
                                          },
                                        }}
                                        onClick={() =>
                                          handleDeleteMessage(message?._id)
                                        }
                                      >
                                        Delete
                                      </Typography>
                                      <Typography
                                        sx={{
                                          padding: "8px",
                                          fontSize: "14px",
                                          ":hover": {
                                            color: primaryColor,
                                            opacity: 0.8,
                                            cursor: "pointer",
                                          },
                                        }}
                                        onClick={() =>
                                          handleClickUpdateMessage(message)
                                        }
                                      >
                                        Edit
                                      </Typography>
                                    </>
                                  )}
                                  <Typography
                                    sx={{
                                      padding: "8px",
                                      fontSize: "14px",
                                      ":hover": {
                                        color: primaryColor,
                                        opacity: 0.8,
                                        cursor: "pointer",
                                      },
                                    }}
                                  >
                                    Forward
                                  </Typography>
                                </Box>
                              </Popover>
                            </Box>
                          </Box>
                        </InteractMessageWrapper>
                      ) : null}

                      <MessageContentWrapper>
                        <MessageTitle>
                          <UserName>{message?.senderName}</UserName>
                          <TimeMessage>
                            {chatTimestamp(message?.createdAt)}
                          </TimeMessage>
                        </MessageTitle>

                        <MessageContentBox>
                          {handleRenderMessageWithType(message)}
                        </MessageContentBox>

                        {message?.replyId && (
                          <MessageQuoteBox>
                            <Box sx={{ ...flexCenter }}>
                              <ReplyIcon
                                fontSize="small"
                                sx={{ color: inActiveColor }}
                              />
                              <Typography
                                fontSize="small"
                                color={inActiveColor}
                              >
                                You have answered{" "}
                                {userInfo?.username == message?.senderName
                                  ? "yourself"
                                  : message?.senderName}
                              </Typography>
                            </Box>
                            <MessageReplyContent mt={1}>
                              {message?.replyMessage?.content ||
                                "The message have deleted"}
                            </MessageReplyContent>
                          </MessageQuoteBox>
                        )}

                        {message?.reactions?.map((reaction, index) => {
                          return (
                            <MessageReactionBox key={index}>
                              <Box
                                sx={{
                                  ...flexCenter,
                                  padding: 0.5,
                                  borderRadius: "5px",
                                  border: `1px solid ${borderColor}`,
                                  backgroundColor: hoverTextColor,
                                  ":hover": {
                                    opacity: 0.8,
                                  },
                                }}
                              >
                                {reaction?.unified && (
                                  <>
                                    <Typography fontSize="small">
                                      {String.fromCodePoint(reaction?.unified)}
                                    </Typography>
                                    <Typography fontSize="small" ml={0.5}>
                                      1
                                    </Typography>
                                  </>
                                )}
                              </Box>
                            </MessageReactionBox>
                          );
                        }) || <></>}

                        {/* <MessageThreadBox>
                        <Box
                          sx={{
                            padding: 0.5,
                            borderRadius: "5px",
                            backgroundColor: primaryColor,
                            color: whiteColor,

                            ":hover": {
                              opacity: 0.8,
                            },
                          }}
                        >
                          <Typography fontSize="small">Thread</Typography>
                        </Box>
                        <Box sx={{ ...flexCenter, ml: 1 }}>
                          <UilCommentMessageIcon width="0.7em" height="0.7em" />
                          <Typography fontSize="11px" ml={0.5}>
                            1
                          </Typography>
                        </Box>
                      </MessageThreadBox> */}
                      </MessageContentWrapper>
                    </MessageItem>
                  );
                })}
            </MessageList>
          </Box>
          {loading && (
            <Box my={10} textAlign="center">
              <CircularProgress color="inherit" size={30} />
            </Box>
          )}
          {!loading && !messages ? <RoomNotFound /> : ""}
        </Box>
      </RoomContentContainer>

      {/* Box message */}
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
    </Box>
  );
};
