import React, { useState } from "react";
import Popover from "@mui/material/Popover";

import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { UilCommentMessageIcon, SymbolsAttachFileIcon } from "@/assets/icons";
import { Box, Typography } from "@/shared/components";
import { RoomHeaderItemImage, RoomHeaderItemName } from "./RoomHeader.styles";
import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";

import { redirectTo } from "@/shared/utils/history";
import { enumPopupFeatures, enumTypeRooms } from "@/shared/utils/constant";
import {
  borderColor,
  primaryColor,
  hoverBackgroundColor,
} from "@/shared/utils/colors.utils";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomHeader = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const setTypeFeatureRoom = useRoomStore((state) => state.setTypeFeatureRoom);

  const [anchorMoreFeatures, setAnchorMoreFeatures] = useState(null);

  const handleClickOpenAnchorMoreFeatures = (event) => {
    setAnchorMoreFeatures(event.currentTarget);
  };

  const handleCloseAnchorMoreFeatures = () => {
    setAnchorMoreFeatures(null);
  };

  const handleOpenFeatureRoom = (feature) => {
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}/${feature}`);
    setTypeFeatureRoom(feature);

    if (anchorMoreFeatures) {
      setAnchorMoreFeatures(null);
    }
  };

  const renderTitleRoom = () => {
    switch (typeRoom) {
      case enumTypeRooms.CHANNEL: {
        return (
          <>
            <Box sx={{ width: "40px", height: "40px" }}>
              <RoomHeaderItemImage src="https://cdnimgen.vietnamplus.vn/uploaded/wbxx/2021_09_09/fourteen_foreign_tv_channels_to_end_broadcast_in_vietnam.jpg" />
            </Box>
            <RoomHeaderItemName>{roomInfo?.channelName}</RoomHeaderItemName>
          </>
        );
      }
      case enumTypeRooms.DIRECT: {
        let filterUserInDirect = roomInfo?.userInfo.find(
          (user) => user?._id !== userInfo?._id
        );

        return (
          <>
            <Box sx={{ width: "40px", height: "40px", display: "flex" }}>
              {filterUserInDirect?.avatar ? (
                <RoomHeaderItemImage src={filterUserInDirect?.avatar} />
              ) : (
                <AccountCircleIcon sx={{ width: '40px', height: '40px'}}/>
              )}
            </Box>
            <RoomHeaderItemName>
              {filterUserInDirect?.username}
            </RoomHeaderItemName>
          </>
        );
      }
    }
  };

  const renderFeatureRoom = () => {
    switch (typeRoom) {
      case enumTypeRooms.CHANNEL: {
        return (
          <>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.CALLING)}
            >
              <PhoneIcon />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.THREAD)}
            >
              <UilCommentMessageIcon viewBox="0 0 60 60" />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.MEMBERS)}
            >
              <GroupIcon />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.SEARCH)}
            >
              <SearchIcon />
            </Box>
            <Box
              sx={{
                m: "0 0 0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
            >
              <MoreVertIcon
                aria-describedby={idAnchorMoreFeatures}
                onClick={handleClickOpenAnchorMoreFeatures}
              />
              <Popover
                id={idAnchorMoreFeatures}
                anchorEl={anchorMoreFeatures}
                open={openAnchorMoreFeatures}
                onClose={handleCloseAnchorMoreFeatures}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px",
                    top: "60px !important",
                  },
                }}
              >
                <Box sx={{ padding: "8px 0" }}>
                  <Box
                    sx={{
                      ...flexCenter,
                      padding: "4px 8px",
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: hoverBackgroundColor,
                      },
                    }}
                    onClick={() =>
                      handleOpenFeatureRoom(enumPopupFeatures.FILES)
                    }
                  >
                    <SymbolsAttachFileIcon fontSize="small" />
                    <Typography fontSize="small">Files</Typography>
                  </Box>
                  <Box
                    sx={{
                      ...flexCenter,
                      padding: "4px 8px",
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: hoverBackgroundColor,
                      },
                    }}
                    onClick={() =>
                      handleOpenFeatureRoom(enumPopupFeatures.TODO_LIST)
                    }
                  >
                    <AssignmentIcon fontSize="small" />
                    <Typography fontSize="small" ml={0.5}>
                      To-do
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ...flexCenter,
                      padding: "4px 8px",
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: hoverBackgroundColor,
                      },
                    }}
                    onClick={() =>
                      handleOpenFeatureRoom(enumPopupFeatures.ROOM_INFO)
                    }
                  >
                    <InfoIcon fontSize="small" />
                    <Typography fontSize="small" ml={0.5}>
                      Channel Information
                    </Typography>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </>
        );
      }
      case enumTypeRooms.DIRECT: {
        let filterUserInDirect = roomInfo?.userInfo.find(
          (user) => user?._id !== userInfo?._id
        );
        return (
          <>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.CALLING)}
            >
              <PhoneIcon />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.USER_INFO)}
            >
              <PersonIcon />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.SEARCH)}
            >
              <SearchIcon />
            </Box>
            <Box
              sx={{
                m: "0 10px",
                ...flexCenter,
                ":hover": {
                  color: primaryColor,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpenFeatureRoom(enumPopupFeatures.FILES)}
            >
              <SymbolsAttachFileIcon fontSize="small" />
            </Box>
          </>
        );
      }
    }
  };

  const openAnchorMoreFeatures = Boolean(anchorMoreFeatures);

  const idAnchorMoreFeatures = openAnchorMoreFeatures
    ? "anchor-more-features-popover"
    : undefined;

  return (
    <Box>
      <Box
        sx={{
          padding: "16px 24px",
          borderBottom: `3px solid ${borderColor}`,
        }}
      >
        <Box
          sx={{
            ...flexCenter,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              ...flexCenter,
            }}
          >
            {renderTitleRoom()}
          </Box>
          <Box
            sx={{
              ...flexCenter,
            }}
          >
            {renderFeatureRoom()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
