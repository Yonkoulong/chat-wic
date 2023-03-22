import React from "react";

import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";

import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@/shared/components";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";

import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";
import { redirectTo } from "@/shared/utils/history";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomInfo = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const userInfo = useAppStore((state) => state.userInfo);
  const setTypeFeatureRoom = useRoomStore((state) => state.setTypeFeatureRoom);

  const handleCloseAnchorMoreFeatures = () => {
    setAnchorMoreFeatures(null);
  };

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
          <InfoIcon />
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
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{ margin: "0 auto", display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              width: "280px",
              height: "280px",
              border: "1px solid",
              margin: "0 auto",
            }}
          >
            <img src="" alt="" width="100%" />
          </Box>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{ margin: "16px auto 0" }}
            disabled={userInfo?.id === roomInfo?.ownerId ? "true" : "false"}
          >
            Leave
          </Button>
        </Box>

        <Box sx={{ ...flexCenter, marginTop: 4 }}>
          <GroupIcon />
          <Typography ml={1} >{roomInfo?.channelName}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
