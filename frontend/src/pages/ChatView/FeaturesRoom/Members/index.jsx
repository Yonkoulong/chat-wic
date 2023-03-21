import React from "react";

import styled, { css } from "styled-components";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  TruncateString,
} from "@/shared/components";

import GroupIcon from "@mui/icons-material/Group";
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
import { useRoomStore } from "@/stores/RoomStore";

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

export const Members = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const setTypeFeatureRoom = useRoomStore((state) => state.setTypeFeatureRoom);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/channel/${roomInfo?._id}`);
  };

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
          <GroupIcon /> 
          <Typography ml={0.5} fontWeight="bold">
            Members
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
          onClick={() => handleClickCloseMembersPopup()}
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
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ maxHeight: `calc(100vh - 220px)`, overflowY: "auto" }}>
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
          onClick={() => redirectTo(`/chat/channel/:id/threads/123`)}
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
                <Typography fontSize="15px">User 1</Typography>
                <Typography
                  fontSize="12px"
                  sx={{ color: inActiveColor, ml: 1 }}
                >
                  Feb 14, 2023
                </Typography>
              </Box>
              <TruncateString color={borderColor} line={"1"}>
                Message
              </TruncateString>
            </Box>
          </Box>
          <Box sx={{ ...flexCenter }}>
            <Box sx={{ ...flexCenter }} mr={1}>
              <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography fontSize="12px" sx={{ color: inActiveColor }}>
                2
              </Typography>
            </Box>
            <Box sx={{ ...flexCenter }}>
              <PersonOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography fontSize="12px" sx={{ color: inActiveColor }}>
                2
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
