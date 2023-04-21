import React, { useEffect, useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

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
import { handleReturnInfoDirectRoom, chatTimestamp } from "@/shared/utils/utils";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const UserInfo = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore((state) => state);
  const userInfo = useAppStore((state) => state.userInfo);

  const [userInfoDirect, setUserInfoDirect] = useState({});

  const handleCloseAnchorMoreFeatures = () => {
    setAnchorMoreFeatures(null);
  };

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  useEffect(() => {
    if(!userInfo && !roomInfo) { return; }
    console.log(userInfo);
    console.log(roomInfo);
    const filterUserInfoDirect = handleReturnInfoDirectRoom(userInfo, roomInfo);
    if(filterUserInfoDirect) {
      setUserInfoDirect(filterUserInfoDirect);
    }
  }, []);

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
            User info
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
              borderRadius: '10px'
            }}
          >
            <img src="" alt="" width="100%" />
          </Box>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{ margin: "16px auto 0", fontWeight: 'bold' }}
            
          >
            Block
          </Button>
        </Box>

        <Box sx={{ ...flexCenter, marginTop: 4 }}>
          <PersonIcon />
          <Typography ml={1}>{userInfoDirect && userInfoDirect?.username}</Typography>
        </Box>
        <Box>
          <Typography mt={2} fontSize="15px">Email</Typography>
          <Typography color={borderColor}>{userInfoDirect && userInfoDirect?.email}</Typography>
        </Box>
        <Box>
          <Typography mt={2} fontSize="15px">Created</Typography>
          <Typography color={borderColor}>{roomInfo && chatTimestamp(roomInfo?.createdAt)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
