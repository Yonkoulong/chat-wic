import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";

import { RoomContentContainer } from "./RoomContent.styles";
import { Box, Typography } from "@/shared/components";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";

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
} from "@/shared/utils/colors.utils";
import { enumTypeRooms } from "@/shared/utils/constant";
import {
  getMessageChannelByChannelId,
  putUpdateMessageChannel,
} from "@/services/channel.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomContent = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const heightQuoteMessage = useChatStore(
    (state) => state.heightQuoteMessageBox
  );

  const [idMessageHovering, setIdMessageHovering] = useState(null);
  const [idEditMessage, setIdEidtMessage] = useState(null);
  const [anchorReaction, setAnchorReaction] = useState(null);
  const [anchorMoreFeatureMessage, setAnchorMoreFeatureMessage] =
    useState(null);

  const handleMouseOver = (message) => {
    setIdMessageHovering(message?._id);
  };

  const handleMouseOut = () => {
    setIdMessageHovering(null);
  };

  useEffect(() => {
    (async () => {
      try {
        let resp;

        if (typeRoom && typeRoom === enumTypeRooms.CHANNEL) {
          resp = await getMessageChannelByChannelId({
            channelId: roomInfo?._id,
          });

          setMessages(resp?.data?.content);
        }

        if (typeInfo && typeInfo === enumTypeRooms.DIRECT) {
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, [roomInfo, typeRoom]);

  const handleClickEmoji = async (emoji) => {
    const { names, unified } = emoji;

    try {
      const newPayload = {
        content: "",
        reaction: {
          emojiName: names[0],
          unified,
          reactorName: userInfo?.username,
          reactorId: userInfo?._id,
          idReaction: userInfo?._id,
        },
      };

      if (!idEditMessage) return;

      const resp = await putUpdateMessageChannel(idEditMessage, newPayload);
    } catch (error) {
      const errorMessage = error?.response?.data?.content;
      toast.error(errorMessage);
    } finally {

    }
  };

  const countNumberReactionPerMemoji = () => {
    
  }

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
            maxHeight: `calc(100vh - 197.38px - ${heightQuoteMessage}px)`,
          }}
        >
          <MessageList>
            {messages &&
              messages?.map((message, index) => {
                return (
                  <MessageItem
                    onMouseOver={() => handleMouseOver(message)}
                    onMouseOut={handleMouseOut}
                    key={message?._id || index}
                  >
                    <UserImageWrapper>
                      <UserImage src={message?.avatar || ""} alt="image" />
                    </UserImageWrapper>

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
                                >
                                  Edit
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
                        <TimeMessage>{message?.createdAt}</TimeMessage>
                      </MessageTitle>

                      <MessageContentBox>
                        <Typography fontSize="small">
                          {message?.content}
                        </Typography>
                      </MessageContentBox>

                      {message?.replyId && (
                        <MessageQuoteBox>
                          <Box sx={{ ...flexCenter }}>
                            <ReplyIcon
                              fontSize="small"
                              sx={{ color: inActiveColor }}
                            />
                            <Typography fontSize="small" color={inActiveColor}>
                              You have answered{" "}
                              {userInfo?.username == message?.senderName
                                ? "yourself"
                                : "message?.senderName"}
                            </Typography>
                          </Box>
                          <MessageReplyContent mt={1}>
                            {message?.replyMessage?.content || ""}
                          </MessageReplyContent>
                        </MessageQuoteBox>
                      )}

                      {message?.reactions?.length > 0 ? (
                        <MessageReactionBox>
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
                            <Typography fontSize="small">
                              {String.fromCodePoint(0x1f600)}
                            </Typography>
                            <Typography fontSize="small" ml={0.5}>
                              1
                            </Typography>
                          </Box>
                        </MessageReactionBox>
                      ) : null}

                      <MessageThreadBox>
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
                      </MessageThreadBox>
                    </MessageContentWrapper>
                  </MessageItem>
                );
              })}
          </MessageList>
        </Box>
      </Box>
    </RoomContentContainer>
  );
};
