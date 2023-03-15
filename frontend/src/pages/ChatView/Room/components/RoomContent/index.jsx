import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";

import { RoomContentContainer } from "./RoomContent.styles";
import { Box, Typography } from "@/shared/components";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

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
  MessageReplyContent
} from "./RoomContent.styles";
import { useRoomStore } from "@/stores/RoomStore";
import { useChatStore } from "@/stores/ChatStore";
import { primaryColor, borderColor } from "@/shared/utils/colors.utils";
import { enumTypeRooms } from "@/shared/utils/constant";
import { getMessageChannelByChannelId } from "@/services/channel.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomContent = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const setQuoteMessage = useChatStore((state) => state.setQuoteMessage);
  const heightQuoteMessage = useChatStore(
    (state) => state.heightQuoteMessageBox
  );

  const [idMessageHovering, setIdMessageHovering] = useState(null);
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

  const handleClickEmoji = (e) => {
    console.log(e);
  };

  //reply
  const handleClickReplyMessage = (message) => {
    if (message) {
      setQuoteMessage(message);
    }
  };

  //handle open anchor
  const handleClickOpenAnchorReaction = (event) => {
    setAnchorReaction(event.currentTarget);
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
                              onClick={handleClickOpenAnchorReaction}
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
                      {message?.replyId && (
                        <MessageReplyContent>{message?.replyMessage?.content || ""}</MessageReplyContent>
                      )}
                      <MessageContentBox>{message?.content}</MessageContentBox>
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
