import React, { useEffect, useState } from "react";
import { RoomContentContainer } from "./RoomContent.styles";
import { Box, Typography } from "@/shared/components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
} from "./RoomContent.styles";
import { useRoomStore } from "@/stores/RoomStore";
import { useChatStore } from "@/stores/ChatStore";
import { primaryColor } from "@/shared/utils/colors.utils";
import { enumTypeRooms } from "@/shared/utils/constant";
import { getMessageChannelByChannelId } from "@/services/channel.services";
import { toast } from "react-toastify";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomContent = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  const [idMessageHovering, setIdMessageHovering] = useState(null);

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

  return (
    <RoomContentContainer>
      <Box>
        <Box
          sx={{
            padding: "24px 0px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 197.38px)",
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
                      <UserImage src={message?.avatar || ""} alt="image"/>
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
                            <LucideQuoteIcon viewBox="0 0 60 60" />
                          </Box>
                          <Box
                            sx={{
                              m: "0 8px",
                              ...flexCenter,
                            }}
                          >
                            <SymbolsAddReactionOutlineIcon viewBox="0 0 60 60" />
                          </Box>
                          <Box
                            sx={{
                              m: "0 8px",
                              ...flexCenter,
                            }}
                          >
                            <UilCommentMessageIcon viewBox="0 0 60 60" />
                          </Box>
                          <Box
                            sx={{
                              m: "0 8px",
                              ...flexCenter,
                              ":hover": {
                                color: primaryColor,
                                cursor: "pointer",
                              },
                            }}
                          >
                            <MoreVertIcon />
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
                        {message?.content}
                      </MessageContentBox>
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
