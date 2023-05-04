import React, { useEffect, useState, useRef, createElement } from "react";
import EmojiPicker from "emoji-picker-react";
// import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";

import { RoomContentContainer } from "./RoomContent.styles";
import { Box, Typography, CircularProgress, Paper } from "@/shared/components";
import { RoomNotFound } from "@/shared/components/RoomNotFound";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  LucideQuoteIcon,
  SymbolsAddReactionOutlineIcon,
  UilCommentMessageIcon,
} from "@/assets/icons";

import {
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
} from "./RoomContent.styles";

import { useAppStore } from "@/stores/AppStore";
import { useRoomStore } from "@/stores/RoomStore";
import { useChatStore } from "@/stores/ChatStore";
import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverTextColor,
  whiteColor,
  blackColor,
} from "@/shared/utils/colors.utils";
import { enumTypeRooms, typesMessage } from "@/shared/utils/constant";
import { chatTimestamp } from "@/shared/utils/utils";
import {
  putUpdateMessageChannel,
  deleteMessageChannel,
} from "@/services/channel.services";

import {
  putMessageDirect,
  deleteMessageDirect,
} from "@/services/direct.services";
import { useSocketStore } from "@/stores/SocketStore";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomContent = () => {
  const { client } = useSocketStore((state) => state);

  const userInfo = useAppStore((state) => state.userInfo);
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const {
    messages,
    pushMessage,
    deleteMessage,
    editMessageStore,
    reactionMessage,
  } = useChatStore((state) => state);
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const setEditMessage = useChatStore((state) => state.setEditMessage);
  const loading = useChatStore((state) => state.loading);
  const setLoading = useChatStore((state) => state.setLoading);
  const heightQuoteMessage = useChatStore(
    (state) => state.heightQuoteMessageBox
  );
  const fetchMessagesChannel = useChatStore(
    (state) => state.fetchMessagesChannel
  );
  const fetchMessagesDirect = useChatStore(
    (state) => state.fetchMessagesDirect
  );

  const [idMessageHovering, setIdMessageHovering] = useState(null);
  const [idEditMessage, setIdEidtMessage] = useState(null);
  const [anchorReaction, setAnchorReaction] = useState(null);
  const [anchorMoreFeatureMessage, setAnchorMoreFeatureMessage] =
    useState(null);

  const scrollRef = useRef(null);

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
          // fetchMessagesChannel({ channelId: roomInfo?._id });
          client?.emit("reaction-message-channel", resp?.data?.content);
          reactionMessage(resp?.data?.content);
        }
      }

      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        const resp = await putMessageDirect(idEditMessage, newPayload);

        if (resp) {
          // fetchMessagesDirect({ directId: roomInfo?._id });
          client?.emit("reaction-message-direct", resp?.data?.content);
          reactionMessage(resp?.data?.content);
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
          client.emit("delete-message-channel", {
            channelId: roomInfo?._id,
            messageId,
          });
          deleteMessage(messageId);
        }
      }

      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        const resp = await deleteMessageDirect(messageId);

        if (resp) {
          // fetchMessagesDirect({ directId: roomInfo?._id });
          client.emit("delete-message-direct", {
            directId: roomInfo?._id,
            messageId,
          });
          deleteMessage(messageId);
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
      <Paper
        sx={{
          width: "360px",
          height: "360px",
          marginTop: 1,
          overflow: "hidden",
        }}
      >
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
        <Typography
          ml={1}
          sx={{
            color: blackColor,
            fontSize: "14px",
            ":hover": {
              textDecoration: "underline",
            },
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
    var urlRegex = /((http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;
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

  const handleCreateThread = (message) => {
    
  }

  useEffect(() => {
    setLoading(true);

    try {
      if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
        fetchMessagesChannel({ channelId: roomInfo?._id });
      }

      if (typeRoom && typeRoom === enumTypeRooms.DIRECT) {
        fetchMessagesDirect({ directId: roomInfo?._id });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
    } finally {
      setLoading(false);
    }
  }, [roomInfo, typeRoom]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messages]);

  //post message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => pushMessage(mess);

    client?.on("receive-message-channel", handler);
    client?.on("receive-message-direct", handler);

    return () => {
      client?.off("receive-message-channel", handler);
      client?.off("receive-message-direct", handler);
    };
  }, [client]);

  //delete message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (msgId) => deleteMessage(msgId);

    client?.on("receive-message-channel-delete", handler);
    client?.on("receive-message-direct-delete", handler);

    return () => {
      client?.off("receive-message-channel-delete", handler);
      client?.off("receive-message-direct-delete", handler);
    };
  }, [client]);

  //edit message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => editMessageStore(mess);

    client?.on("receive-message-channel-edit", handler);
    client?.on("receive-message-direct-edit", handler);

    return () => {
      client?.off("receive-message-channel-edit", handler);
      client?.off("receive-message-direct-edit", handler);
    };
  }, [client]);

  //reaction message realtime
  useEffect(() => {
    if (!client) {
      return;
    }

    const handler = (mess) => reactionMessage(mess);

    client?.on("receive-message-channel-reaction", handler);
    client?.on("receive-message-direct-reaction", handler);

    return () => {
      client?.off("receive-message-channel-reaction", handler);
      client?.off("receive-message-direct-reaction", handler);
    };
  }, [client]);

  //close anchor
  const handleCloseAnchorReaction = () => {
    setAnchorReaction(null);
  };

  const handleCloseAnchorMoreFeatureMessage = () => {
    setAnchorMoreFeatureMessage(null);
  };

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
    <RoomContentContainer>
      <Box>
        <Box
          sx={{
            padding: "24px 0px",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: `calc(100vh - 187.62px - ${heightQuoteMessage}px)`,
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
                        editMessage?._id === message?._id ? hoverTextColor : "",
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
                              '&:hover': {
                                cursor: 'pointer'
                              }
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
                            <Typography fontSize="small" color={inActiveColor}>
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
                            {message?.replyMessage?.content ||
                              "The message have deleted"}
                          </MessageReplyContent>
                        </MessageQuoteBox>
                      )}

                      {(message?.reactions[0] &&
                        message?.reactions?.map((reaction, index) => {
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
                        })) || <></>}

                      <MessageThreadBox>
                        <Box
                          sx={{
                            padding: 0.5,
                            borderRadius: "5px",
                            backgroundColor: primaryColor,
                            color: whiteColor,

                            ":hover": {
                              opacity: 0.8,
                              cursor: "pointer"
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
                      </MessageThreadBox>
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
  );
};
