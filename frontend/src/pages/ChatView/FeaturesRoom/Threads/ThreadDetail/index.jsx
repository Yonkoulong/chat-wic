import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

import {
  Box,
  Typography,
  IconButton,
  TruncateString,
  TextareaAutosize,
  Paper,
  CircularProgress,
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

import { ModalUploadFileThreadPreview } from "@/pages/ChatView/Components/Modal";

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
import {
  hasWhiteSpace,
  isObjectEmpty,
  handleRenderMessageCustomWithType,
} from "@/shared/utils/utils";

import {
  putUpdateMessageChannel,
  getMessageChannelDetail,
} from "@/services/channel.services";

import { postMessageThread, deleteMessageThread, editMessageThread } from "@/services/thread.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const ThreadDetail = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );
  const userInfo = useAppStore((state) => state.userInfo);
  const {
    messagesThread,
    pushThreadMessage,
    deleteThreadMessage,
    editThreadMessageStore,
    reactionThreadMessage,
    fetchMessagesThreadChannel,
    editThreadMessage,
    setEditThreadMessage,
    loading,
    setLoading,
    selectedThreadMessage,
    setSelectedThreadMessage,
  } = useThreadStore((state) => state);
  const { client } = useSocketStore((state) => state);

  const [idMessageHovering, setIdMessageHovering] = useState(null);
  const [isDisplayIconChat, setIsDisplayIconChat] = useState(false);
  const [idEditMessage, setIdEidtMessage] = useState(null);
  const [openUploadFileModal, setOpenUpladFileModal] = useState(false);
  const [fileListObject, setFileListObject] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  const [quoteThreadMessage, setQuoteThreadMessage] = useState(null);
  const [heightQuoteThreadMessageBox, setHeightQuoteThreadMessageBox] = useState(0);
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
        if (quoteThreadMessage) {
          handleCancelQuoteMessage();
        }

        if (editThreadMessage) {
          setEditThreadMessage(null);
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
        if (editThreadMessage) {
          const newPayLoadEditMessageChannel = {
            content: value,
          };

          const resp = await editMessageThread(
            editThreadMessage?._id,
            newPayLoadEditMessageChannel
          );

          if (resp) {
            client?.emit("edit-message-thread", resp?.data?.content);
            editThreadMessageStore(resp?.data?.content);
          }
        } else {
          const newPayloadMessageChannel = {
            messageFrom: userInfo?._id,
            senderAvatar: userInfo?.avatar,
            senderName: userInfo?.username,
            content: value,
            channelId: id,
            type: type,
            replyId: quoteThreadMessage?._id || null,
            threadId: selectedThreadMessage?._id,
          };

          const resp = await postMessageThread(
            selectedThreadMessage?._id,
            newPayloadMessageChannel
          );
          if (resp) {
            client.emit("send-message-thread", resp?.data);
            pushThreadMessage(resp?.data);
          }
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.content;
      toast.error(errorMessage);
    }
  };

  const handleCancelQuoteMessage = () => {
    setQuoteThreadMessage(null);
    setHeightQuoteThreadMessageBox(0);
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
        const resp = await editMessageThread(idEditMessage, newPayload);

        if (resp) {
          client?.emit("reaction-mesage-thread", resp?.data?.content);
          reactionThreadMessage(resp?.data?.content);
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
      setQuoteThreadMessage(message);

      setTimeout(() => {
        textAreaRef.current.focus();
      }, 100);
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
        const resp = await deleteMessageThread(messageId);

        if (resp) {
          client.emit("delete-message-thread", {
            threadId: selectedThreadMessage?.threadId,
            messageId,
          });
          deleteThreadMessage(messageId);
          // fetchMessagesThreadChannel({ channelId: roomInfo?._id });
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
        setQuoteThreadMessage(message?.replyMessage);
      }
      setEditThreadMessage(message);
      setAnchorMoreFeatureMessage(null);

      if(message?.type === typesMessage.PLAIN_TEXT) {
        textAreaRef.current.value = message?.content;
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
      <Paper sx={{ width: "260px", height: "260px", marginTop: 1 }}>
        <img
          src={message?.content}
          alt="image-message"
          style={{ width: "100%", objectFit: "cover", height: "100%" }}
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
        <Typography
          ml={1}
          sx={{
            color: blackColor,
            fontSize: "14px",
          }}
        >
          {message?.fileName} - {Math.round((message?.size / 1024) * 100) / 100}{" "}
          KB
        </Typography>
      </Box>
    );
  };

  const renderMessageWithTypeVideo = (message) => {
    return (
      <Paper sx={{ width: "fit-content", marginTop: 1 }}>
        <video
          width="220"
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
    var urlRegex =
      /((http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;
    if (urlRegex.test(content)) {
      const newUrl = content.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
      return <div dangerouslySetInnerHTML={{ __html: newUrl }}></div>;
    } else {
      return <Typography fontSize="small">{content}</Typography>;
    }
  };

  const handleRenderNameForReply = (message) => {
    if (userInfo?._id === message?.replyMessage?.messageFrom) {
      if (userInfo?._id === message?.messageFrom) {
        return "yourself";
      } else {
        return "you";
      }
    } else {
      return message?.replyMessage?.senderName || "Unknown";
    }
  };

  const handleClickCloseThread = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      if (threadId) {
        try {
          const respMessageChannel = await getMessageChannelDetail({
            messageId: threadId,
          });
          const respMessageThreadChannel = fetchMessagesThreadChannel(threadId);
          if (!respMessageChannel && !respMessageThreadChannel) {
            return;
          }

          client?.emit("join-message-thread", threadId);
          setSelectedThreadMessage(respMessageChannel?.data?.content);
        } catch (error) {
          throw error;
        }
      }
    })();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messagesThread]);

  useEffect(() => {
    if(quoteThreadMessage) {
      const heightQuoteMessage = quoteMessageRef.current?.offsetHeight;
      setHeightQuoteThreadMessageBox(heightQuoteMessage);
    }
  }, [quoteThreadMessage])

  //post message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => pushThreadMessage(mess);
    client?.on("receive-message-thread", handler);

    return () => {
      client?.off("receive-message-thread", handler);
    };
  }, [client]);

  //delete message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (msgId) => deleteThreadMessage(msgId);
    client?.on("receive-message-thread-delete", handler);

    return () => {
      client?.off("receive-message-thread-delete", handler);
    };
  }, [client]);

  //edit message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => editThreadMessageStore(mess);
    client?.on("receive-message-thread-edit", handler);

    return () => {
      client?.off("receive-message-thread-edit", handler);
    };
  }, [client]);

  //reaction message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => reactionThreadMessage(mess);
    client?.on("receive-message-thread-reaction", handler);

    return () => {
      client?.off("receive-message-thread-reaction", handler);
    };
  }, [client]);

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
      {/* Box header */}
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
          <Box ml={0.5} sx={{ width: "200px" }}>
            {selectedThreadMessage &&
              handleRenderMessageCustomWithType(selectedThreadMessage)}
          </Box>
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
              maxHeight: `calc(100vh - 262.8px - ${
                heightQuoteThreadMessageBox || 0
              }px)`,
            }}
          >
            <MessageList>
              {!loading &&
                messagesThread &&
                messagesThread?.map((message, index) => {
                  return (
                    <MessageItem
                      onMouseOver={() => handleMouseOver(message)}
                      onMouseOut={handleMouseOut}
                      key={message?._id || index}
                      ref={scrollRef}
                      sx={{
                        backgroundColor:
                          editThreadMessage?._id === message?._id
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
                                      {message?.type ===
                                        typesMessage.PLAIN_TEXT && (
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
                                      )}
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
                                {userInfo?._id == message?.messageFrom
                                  ? `You have answered ${handleRenderNameForReply(
                                      message
                                    )}`
                                  : message?.senderName +
                                    ` have answered ${handleRenderNameForReply(
                                      message
                                    )}`}
                              </Typography>
                            </Box>
                            <MessageReplyContent mt={1}>
                              {handleRenderMessageCustomWithType(message?.replyMessage) ||
                                "The message have deleted"}
                            </MessageReplyContent>
                          </MessageQuoteBox>
                        )}

                        {message?.reactions.length > 0 && (
                          <MessageReactionBox>
                            {message?.reactions?.map((reaction, index) => {
                              return (
                                  <Box
                                    sx={{ ...flexCenter,}}
                                    key={index}
                                  >
                                    {reaction?.unified && (
                                      <Typography fontSize="small">
                                        {String.fromCodePoint(reaction?.unified)}
                                      </Typography>                                      
                                    )}
                                  </Box>
                              );
                            })}
                            <Typography fontSize="small" p="0px 4px">
                              {message?.reactions.length}
                            </Typography>
                          </MessageReactionBox>
                        )}
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
          {/* {!loading && !messagesThread ? <RoomNotFound /> : ""} */}
        </Box>
      </RoomContentContainer>

      {/* Box message */}
      <BoxMessageContainer>
        {quoteThreadMessage ? (
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
                {userInfo?.username == quoteThreadMessage?.senderName
                  ? "yourself"
                  : quoteThreadMessage?.senderName}
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
                {handleRenderMessageCustomWithType(quoteThreadMessage)}
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
        <ModalUploadFileThreadPreview
          open={openUploadFileModal}
          onClose={setOpenUpladFileModal}
          data={fileListObject}
          formFile={uploadFile}
        />
      </BoxMessageContainer>
    </Box>
  );
};
