import React, { useState } from "react";
import Popover from "@mui/material/Popover";

import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { UilCommentMessageIcon } from "@/assets/icons";
import { Box } from "@/shared/components";
import { RoomHeaderItemImage, RoomHeaderItemName } from "./RoomHeader.styles";
import { useRoomStore } from "@/stores/RoomStore";
import { redirectTo } from '@/shared/utils/history';
import { enumPopupFeatures } from "@/shared/utils/constant";
import { borderColor, primaryColor } from "@/shared/utils/colors.utils";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomHeader = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const setEnumPopupFeatures = useRoomStore((state) => state.setEnumPopupFeatures);

  const [anchorMoreFeatures, setAnchorMoreFeatures] = useState(null);
  
  const handleClickOpenAnchorMoreFeatures = (event) => {
    setAnchorMoreFeatures(event.currentTarget);
  };

  const handleCloseAnchorMoreFeatures = () => {
    setAnchorMoreFeatures(null);
  };

  const handleOpenFeatureRoom = (feature) => {
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}/${feature}`)
    setEnumPopupFeatures(feature)
  }

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
            <RoomHeaderItemImage src="/" />
            <RoomHeaderItemName>{roomInfo?.channelName}</RoomHeaderItemName>
          </Box>
          <Box
            sx={{
              ...flexCenter,
            }}
          >
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
                <Box>Hello</Box>
              </Popover>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
