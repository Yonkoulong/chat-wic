import React, { useState, useEffect, useRef } from "react";
import Popover from "@mui/material/Popover";

import { Box, Typography } from "@/shared/components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MessageIcon from "@mui/icons-material/Message";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import PersonIcon from "@mui/icons-material/Person";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getChannelsByUser } from "@/services/channel.services";
import { useAppStore } from "@/stores/AppStore";
import { ModalCreateDirect, ModalCreateChannel } from '@/pages/ChatView/Components/Modal';
import {
  SidebarContainer,
  SidebarWrapper,
  SidebarHeader,
  SidebarHeaderList,
  SidebarHeaderItem,
  SidebarHeaderItemImage,
  SidebarBody,
  SidebarBodyWrapper,
  SidebarBodyList,
  SidebarBodyItem,
  SidebarBodyItemName,
  SidebarBodyItemNameText,
  SidebarBodyItemRooms,
  SidebarBodyItemRoomWrapper,
  SidebarBodyItemRoomImage,
  SidebarBodyItemRoomStatus,
  SidebarBodyItemRoomName,
  SidebarFooter,
  SidebarFooterWrapper,
  SidebarFooterContent,
  SidebarFooterText,
  SidebarHeaderAnchorUserInfo,
  AnchorUserInfoHeader,
  AnchorUserInfoHeaderImage,
  AnchorUserInfoTitleStatus,
  AnchorUserInfoTitleName,
  AnchorUserInfoEmail,
  AnchorUserInfoBody,
  AnchorUserInfoBodyTitle,
  AnchorUserInfoBodyStatus,
  AnchorUserInfoBodyText,
  AnchorUserInfoBottom,
  AnchorUserInfoBottomItemText,
  AnchorRoomTitle,
  AnchorRoomWrapper,
  AnchorRoomText,
} from "./Sidebar.styles";
import {
  successColor,
  errorColor,
  primaryColor,
} from "@/shared/utils/colors.utils";
import { enumRoles } from "@/shared/utils/constant";
import { redirectTo } from "@/shared/utils/history";

const flexCenter = { display: "flex", alignItems: "center" };

const Sidebar = () => {
  const { userInfo } = useAppStore((state) => state);

  const [anchorUserInfo, setAnchorUserInfo] = useState(null);
  const [anchorRoom, setAnchorRoom] = useState(null);
  const [totalHeightSubtract, setTotalHeightSubtract] = useState(0);
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [openCreateDirectMessageModal, setOpenCreateDirectMessageModal] = useState(false);

  const SidebarHeaderRef = useRef(0);
  const SidebarBottomRef = useRef(0);
  const [channels, setChannels] = useState([]);
  const [directs, setDirects] = useState([]);

  const handleSetMaxHeightForSidebarBody = () => {
    if (SidebarHeaderRef.current && SidebarBottomRef.current) {
      const totalHeightSubtract =
        SidebarHeaderRef.current.offsetHeight +
        SidebarBottomRef.current.offsetHeight;
      setTotalHeightSubtract(totalHeightSubtract);
    }
  };

  useEffect(() => {
    handleSetMaxHeightForSidebarBody();
  }, [totalHeightSubtract]);

  const handleClickOpenAnchorUserInfo = (event) => {
    setAnchorUserInfo(event.currentTarget);
  };

  const handleCloseAnchorUserInfo = () => {
    setAnchorUserInfo(null);
  };

  const handleClickOpenAnchorRoom = (event) => {
    setAnchorRoom(event.currentTarget);
  };

  const handleCloseAnchorRoom = () => {
    setAnchorRoom(null);
  };

  const handleLogout = () => {};

  const handleClickOpenModalCreateChannel = () => {
    setOpenCreateChannelModal(true);
  };

  const handleClickOpenModalCreateDirect = () => {
    setOpenCreateDirectMessageModal(true);
  };

  const openAnchorUserInfo = Boolean(anchorUserInfo);
  const openAnchorRoom = Boolean(anchorRoom);

  const idAnchorUserInfo = openAnchorUserInfo
    ? "anchor-user-info-popover"
    : undefined;
  const idAnchorRoom = openAnchorRoom ? "ancho-room-popover" : undefined;

  useEffect(() => {
    (async () => {
      try {
        const payload = { userId: "63e9e5d0a831c1390cd043da" };
        const respChannels = await getChannelsByUser(payload);
        if (Array.isArray(respChannels?.data?.content)) {
          setChannels(respChannels?.data?.content);
        }
      } catch {}
    })();
  }, []);

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarHeader ref={SidebarHeaderRef}>
          <SidebarHeaderList>
            <SidebarHeaderItem>
              <SidebarHeaderItemImage
                src="/"
                onClick={handleClickOpenAnchorUserInfo}
              />
              <Popover
                id={idAnchorUserInfo}
                anchorEl={anchorUserInfo}
                open={openAnchorUserInfo}
                onClose={handleCloseAnchorUserInfo}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px",
                    top: '60px !important'
                  },
                }}
              >
                <SidebarHeaderAnchorUserInfo>
                  <Box>
                    <AnchorUserInfoHeader>
                      <AnchorUserInfoHeaderImage src="/" />
                      <Box
                        sx={{ display: "flex", flexDirection: "column", ml: 1 }}
                      >
                        <Box sx={flexCenter}>
                          <AnchorUserInfoTitleStatus></AnchorUserInfoTitleStatus>
                          <AnchorUserInfoTitleName>
                            Long Yonkou
                          </AnchorUserInfoTitleName>
                        </Box>
                        <AnchorUserInfoEmail>
                          longyonkou@gmai.com
                        </AnchorUserInfoEmail>
                      </Box>
                    </AnchorUserInfoHeader>

                    <AnchorUserInfoBody>
                      <AnchorUserInfoBodyTitle>Status</AnchorUserInfoBodyTitle>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          margin: "8px 0 0",
                        }}
                      >
                        <Box
                          sx={{
                            ...flexCenter,
                            ":hover": {
                              opacity: 0.8,
                              cursor: "pointer",
                            },
                          }}
                        >
                          <AnchorUserInfoBodyStatus
                            sx={{
                              backgroundColor: successColor,
                              border: "none",
                            }}
                          ></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>
                            online
                          </AnchorUserInfoBodyText>
                        </Box>
                        <Box
                          sx={{
                            ...flexCenter,
                            ":hover": {
                              opacity: 0.8,
                              cursor: "pointer",
                            },
                          }}
                        >
                          <AnchorUserInfoBodyStatus
                            sx={{ backgroundColor: errorColor, border: "none" }}
                          ></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>busy</AnchorUserInfoBodyText>
                        </Box>
                        <Box
                          sx={{
                            ...flexCenter,
                            ":hover": {
                              opacity: 0.8,
                              cursor: "pointer",
                            },
                          }}
                        >
                          <AnchorUserInfoBodyStatus></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>
                            offline
                          </AnchorUserInfoBodyText>
                        </Box>
                      </Box>
                    </AnchorUserInfoBody>

                    <AnchorUserInfoBottom>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <Box
                          sx={{
                            ...flexCenter,
                            ":hover": {
                              color: primaryColor,
                              cursor: "pointer",
                            },
                          }}
                        >
                          <PersonIcon />
                          <AnchorUserInfoBottomItemText>
                            My account
                          </AnchorUserInfoBottomItemText>
                        </Box>
                        {userInfo?.role === enumRoles.ADMIN ? (
                          <Box
                            sx={{
                              ...flexCenter,
                              ":hover": {
                                color: primaryColor,
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => redirectTo("/admin")}
                          >
                            <GridViewIcon />
                            <AnchorUserInfoBottomItemText>
                              Admin management
                            </AnchorUserInfoBottomItemText>
                          </Box>
                        ) : (
                          <></>
                        )}

                        <Box
                          sx={{
                            ...flexCenter,
                            ":hover": {
                              color: primaryColor,
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleLogout()}
                        >
                          <KeyboardBackspaceIcon />
                          <AnchorUserInfoBottomItemText>
                            Logout
                          </AnchorUserInfoBottomItemText>
                        </Box>
                      </Box>
                    </AnchorUserInfoBottom>
                  </Box>
                </SidebarHeaderAnchorUserInfo>
              </Popover>
            </SidebarHeaderItem>

            <SidebarHeaderItem>
              <HomeIcon sx={{ display: "flex" }} />
            </SidebarHeaderItem>

            <SidebarHeaderItem>
              <SearchIcon sx={{ display: "flex" }} />
            </SidebarHeaderItem>

            <SidebarHeaderItem>
              <CreateRoundedIcon
                sx={{ display: "flex" }}
                onClick={handleClickOpenAnchorRoom}
              />
              <Popover
                id={idAnchorRoom}
                anchorEl={anchorRoom}
                open={openAnchorRoom}
                onClose={handleCloseAnchorRoom}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px",
                    top: '56px !important'
                  },
                }}
              >
                <Box
                  sx={{
                    padding: "16px",
                  }}
                >
                  <AnchorRoomTitle>Create new</AnchorRoomTitle>
                  <AnchorRoomWrapper>
                    <Box
                      sx={{
                        ...flexCenter,
                        ":hover": {
                          color: primaryColor,
                          cursor: "pointer",
                        },
                      }}

                      onClick={handleClickOpenModalCreateChannel}
                    >
                      <Box component='h4' sx={{
                        fontSize: "20px",
                        fontWeight: 'bold',
                        width: '24px',
                        textAlign: 'center'
                      }}>#</Box>
                      <AnchorRoomText>Channel</AnchorRoomText>
                    </Box>
                    <Box
                      sx={{
                        ...flexCenter,
                        ":hover": {
                          color: primaryColor,
                          cursor: "pointer",
                        },
                      }}

                      onClick={handleClickOpenModalCreateDirect}
                    >
                      <ChatBubbleOutlineIcon />
                      <AnchorRoomText>Direct message</AnchorRoomText>
                    </Box>
                  </AnchorRoomWrapper>
                </Box>
              </Popover>
            </SidebarHeaderItem>
          </SidebarHeaderList>
        </SidebarHeader>

        <SidebarBody>
          <SidebarBodyWrapper
            sx={{ maxHeight: `calc(100% - ${totalHeightSubtract}px)` }}
          >
            <SidebarBodyList>
              <SidebarBodyItem>
                <SidebarBodyItemName>
                  <ArrowDropDownIcon />
                  <SidebarBodyItemNameText>Channels</SidebarBodyItemNameText>
                </SidebarBodyItemName>
                <SidebarBodyItemRooms>
                  {channels.length > 0 &&
                    channels.map((channel) => {
                      return (
                        <SidebarBodyItemRoomWrapper key={channel?._id}>
                          <SidebarBodyItemRoomImage
                            src="https://cdnimgen.vietnamplus.vn/uploaded/wbxx/2021_09_09/fourteen_foreign_tv_channels_to_end_broadcast_in_vietnam.jpg"
                            alt="logo"
                          />
                          <SidebarBodyItemRoomStatus
                            sx={{ backgroundColor: "red" }}
                          />
                          <SidebarBodyItemRoomName>
                            {channel?.channelName || "-"}
                          </SidebarBodyItemRoomName>
                        </SidebarBodyItemRoomWrapper>
                      );
                    })}
                </SidebarBodyItemRooms>
              </SidebarBodyItem>

              <SidebarBodyItem>
                <SidebarBodyItemName>
                  <ArrowDropDownIcon />
                  <SidebarBodyItemNameText>Direct</SidebarBodyItemNameText>
                </SidebarBodyItemName>

                <SidebarBodyItemRooms>
                  <SidebarBodyItemRoomWrapper>
                    <SidebarBodyItemRoomImage />
                    <SidebarBodyItemRoomStatus></SidebarBodyItemRoomStatus>
                    <SidebarBodyItemRoomName>User-1</SidebarBodyItemRoomName>
                  </SidebarBodyItemRoomWrapper>
                </SidebarBodyItemRooms>

                <SidebarBodyItemRooms>
                  <SidebarBodyItemRoomWrapper>
                    <SidebarBodyItemRoomImage />
                    <SidebarBodyItemRoomStatus></SidebarBodyItemRoomStatus>
                    <SidebarBodyItemRoomName>User-1</SidebarBodyItemRoomName>
                  </SidebarBodyItemRoomWrapper>
                </SidebarBodyItemRooms>
              </SidebarBodyItem>
            </SidebarBodyList>
          </SidebarBodyWrapper>
        </SidebarBody>

        <SidebarFooter ref={SidebarBottomRef}>
          <SidebarFooterWrapper>
            <MessageIcon fontSize="large" />
            <SidebarFooterContent>
              <SidebarFooterText>Powered by YonkouLong</SidebarFooterText>
              <SidebarFooterText>Free edition</SidebarFooterText>
            </SidebarFooterContent>
          </SidebarFooterWrapper>
        </SidebarFooter>
      </SidebarWrapper>

      {/* modal create channel */}
      <ModalCreateChannel
        open={openCreateChannelModal}
        onClose={setOpenCreateChannelModal}
      />

      {/* modal create direct */}
      <ModalCreateDirect
        open={openCreateDirectMessageModal}
        onClose={setOpenCreateDirectMessageModal}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
