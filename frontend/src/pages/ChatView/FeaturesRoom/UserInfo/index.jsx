import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from '@mui/icons-material/Block';
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
import { redirectTo } from "@/shared/utils/history";
import { handleReturnInfoDirectRoom, chatTimestamp } from "@/shared/utils/utils";
import { enumTypeRooms } from "@/shared/utils/constant";

import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const UserInfo = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore((state) => state);
  const userInfo = useAppStore((state) => state.userInfo);

  const [userInfoPopup, setUserInfoPopup] = useState({});

  const { userId } = useParams();

  const handleCloseAnchorMoreFeatures = () => {
    setAnchorMoreFeatures(null);
  };

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };
  
  useEffect(() => {
    if(!userInfo && !roomInfo) { return; }

    if(typeRoom === enumTypeRooms.DIRECT) {
      const filterUserInfoDirect = handleReturnInfoDirectRoom(userInfo, roomInfo);
      if(filterUserInfoDirect) {
        setUserInfoPopup(filterUserInfoDirect);
      }
    }

    if(typeRoom === enumTypeRooms.CHANNEL) {
      const filterUserInfoChannel = roomInfo?.membersInChannel?.find((user) => user?._id == userId)
      setUserInfoPopup(filterUserInfoChannel)
    }
  }, []);

  console.log(userInfoPopup);
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
            User Info
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
      <Box sx={{ padding: 2,  maxHeight: `calc(100vh - 148px)`, overflowY: "auto"  }}>
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
            <img src={userInfoPopup?.avatar || ''} alt="" style={{width:"100%", height:"100%", borderRadius: '10px', objectFit: 'cover'}} />
          </Box>

          <Button
            variant="outlined"
            startIcon={<BlockIcon />}
            sx={{ margin: "16px auto 0", fontWeight: 'bold' }}
            
          >
            Block
          </Button>
        </Box>

        <Box sx={{ ...flexCenter, marginTop: 4 }}>
          <PersonIcon />
          <Typography ml={1}>{userInfoPopup && userInfoPopup?.username}</Typography>
        </Box>
        <Box>
          <Typography mt={2} fontSize="15px">Email</Typography>
          <Typography color={inActiveColor}>{userInfoPopup && userInfoPopup?.email}</Typography>
        </Box>
        <Box>
          <Typography mt={2} fontSize="15px">Created</Typography>
          <Typography color={inActiveColor}>{userInfoPopup && chatTimestamp(userInfoPopup?.createdAt)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
