import React, { useState } from "react";

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
  PopUpConfirm
} from "@/shared/components";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";
import { order } from '@/shared/utils/constant';

import { deleteMemberInChannel, getChannelsByUser } from "@/services/channel.services";

import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";
import { redirectTo } from "@/shared/utils/history";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const RoomInfo = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom, setChannelRooms } = useRoomStore((state) => state);
  const userInfo = useAppStore((state) => state.userInfo);

  const [openPopupConfirm, setOpenPopupConfirm] = useState(false)

  const handleOpenPopupLeaveRoom = () => {
    setOpenPopupConfirm(true);
  }

  const handleLeaveRoom = async () => {
    if(userInfo?._id) {
      try {
        const resp = await deleteMemberInChannel(roomInfo?._id, userInfo?._id);
        const payload = {
          organizeId: userInfo?.organizeId,
          orders: {
            updatedAt: order.DESCENDING,
          },
        };

        if(resp) {
          const respChannels = await getChannelsByUser(userInfo?._id, payload);
          if (Array.isArray(respChannels?.data?.content)) {
            setChannelRooms(respChannels?.data?.content);
          }
        }
      } catch (error) {
        throw error;
      }
    }
  }

  const handleClosePopupLeaveRoom = () => {
    setOpenPopupConfirm(false);
  }

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
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
            Channel Infomation
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
      <Box sx={{ padding: 2, maxHeight: `calc(100vh - 148pxpx)`, overflowY: "auto" }}>
        <Box
          sx={{ margin: "0 auto", display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              width: "280px",
              height: "280px",
              border: "1px solid",
              margin: "0 auto",
              borderRadius: '10px'
            }}
          >
            <img src="" alt="" width="100%" />
          </Box>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{ margin: "16px auto 0" }}
            disabled={userInfo?.id === roomInfo?.ownerId}
            onClick={() => handleOpenPopupLeaveRoom()}
          >
            Leave
          </Button>
        </Box>

        <Box sx={{ ...flexCenter, marginTop: 4 }}>
          <GroupIcon />
          <Typography ml={1} >{roomInfo?.channelName}</Typography>
        </Box>
      </Box>

      <PopUpConfirm 
        open={openPopupConfirm}
        onCancel={handleClosePopupLeaveRoom}
        onConfirm={() => handleLeaveRoom()}
        content="Are you sure leave this room?"
      />
    </Box>
  );
};
