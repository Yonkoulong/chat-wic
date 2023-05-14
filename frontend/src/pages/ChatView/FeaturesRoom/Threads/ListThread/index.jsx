import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled, { css } from "styled-components";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  TruncateString,
} from "@/shared/components";

import { UilCommentMessageIcon } from "@/assets/icons";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";
import { redirectTo } from "@/shared/utils/history";
import { handleRenderMessageCustomWithType, timeCustomize } from "@/shared/utils/utils";

import { useRoomStore } from "@/stores/RoomStore";
import { useChatStore } from "@/stores/ChatStore";
import { useSocketStore } from "@/stores/SocketStore";

const TableCellSearchInput = styled(TextField)`
  ${({ theme: {} }) => css`
    fieldSet {
    }
    &&& {
      background-color: white;
    }
  `}
`;

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const ListThread = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );
  const { messages } = useChatStore((state) => state);
  const { client } = useSocketStore((state) => state);
  const { id } = useParams();

  const [threads, setThreads] = useState([]);

  const handleClickCloseThread = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleRedirecToThreadDetail = (thread) => {
    redirectTo(`/chat/channel/${id}/threads/${thread?.threadId}`)
    client.emit("join-message-thread", thread?.threadId);
  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      const newThreads = messages.filter((msg) => msg?.threadId);
      setThreads(newThreads);
    }
  }, [messages]);

  return (
    <Box>
      <Box
        sx={{
          ...flexCenter,
          justifyContent: "space-between",
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <UilCommentMessageIcon />
          <Typography ml={0.5} fontWeight="bold">
            Threads
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

      <Box sx={{ padding: 2, borderBottom: `1px solid ${borderColor}` }}>
        <TableCellSearchInput
          placeholder="Search"
          fullWidth
          //   name={fieldName}
          size="small"
          //   value={searchKey}
          //   onChange={handleChangeSeachKey}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                <SearchIcon fontSize="medium" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ maxHeight: `calc(100vh - 220px)`, overflowY: "auto" }}>
        {threads?.length > 0 &&
          threads.map((thread) => {
            return (
              <Box
                sx={{
                  ...flexCenter,
                  justifyContent: "space-between",
                  padding: 2,
                  borderBottom: `1px solid ${borderColor}`,
                  ":hover": {
                    backgroundColor: hoverTextColor,
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleRedirecToThreadDetail(thread)}
              >
                <Box sx={{ display: "flex" }}>
                  <Box>
                    <img
                      src=""
                      alt=""
                      width={40}
                      height={40}
                      sx={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Box ml={1}>
                    <Box sx={{ ...flexCenter }}>
                      <Typography fontSize="15px">
                        {thread?.senderName || ""}
                      </Typography>
                      <Typography
                        fontSize="12px"
                        sx={{ color: inActiveColor, ml: 1 }}
                      >
                        {timeCustomize(thread?.threadInfo?.createAtThread)}
                      </Typography>
                    </Box>
                    <Box color={borderColor} sx={{ width: "200px"}}>
                      {handleRenderMessageCustomWithType(thread)}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ ...flexCenter }}>
                  {thread?.threadInfo?.totalMessagesInThread && (
                    <Box sx={{ ...flexCenter }} mr={1}>
                      <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography fontSize="12px" sx={{ color: inActiveColor }}>
                        {thread?.threadInfo?.totalMessagesInThread}
                      </Typography>
                    </Box>
                  )}
                  {thread?.threadInfo?.totalMembersInThread && (
                    <Box sx={{ ...flexCenter }}>
                      <PersonOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography fontSize="12px" sx={{ color: inActiveColor }}>
                        {thread?.threadInfo?.totalMembersInThread}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
