import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { getChannelsByUser } from "@/services/channel.services";
import { getDirectsByUserId } from "@/services/direct.services";
import { putUpdateUserStatus } from "@/services/member.services";

import { useAppStore } from "@/stores/AppStore";
import { useRoomStore } from "@/stores/RoomStore";
import { useSocketStore } from "@/stores/SocketStore";

import {
  ModalCreateDirect,
  ModalCreateChannel,
} from "@/pages/ChatView/Components/Modal";
import { SearchRoom } from "./components/SearchRoom";

import {
  SidebarContainer,
  SidebarWrapper,
  SidebarHeader,
  SidebarHeaderList,
  SidebarHeaderItem,
  SidebarHeaderItemImage,
  SidebarHeaderItemStatus,
  SidebarBody,
  SidebarBodyWrapper,
  SidebarBodyList,
  SidebarBodyItem,
  SidebarBodyItemName,
  SidebarBodyItemNameText,
  SidebarBodyListRoom,
  SidebarBodyItemRooms,
  SidebarBodyItemRoomWrapper,
  SidebarBodyItemRoomImage,
  SidebarBodyItemRoomStatus,
  SidebarBodyItemRoomName,
  SidebarBodyItemRoomMessage,
  SidebarBodyItemRoomTime,
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
import { enumRoles, enumMemberStatus, order } from "@/shared/utils/constant";
import { redirectTo } from "@/shared/utils/history";
import {
  handleReturnInfoDirectRoom,
  handleReturnColorStatus,
} from "@/shared/utils/utils";

const flexCenter = { display: "flex", alignItems: "center" };

const Sidebar = () => {
  const { userInfo } = useAppStore((state) => state);
  const { channelRooms, directRooms, setChannelRooms, setDirectRooms } =
    useRoomStore((state) => state);
  const { typeFeatureRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );
  const client = useSocketStore((state) => state.client);
  
  const [anchorUserInfo, setAnchorUserInfo] = useState(null);
  const [anchorRoom, setAnchorRoom] = useState(null);
  const [totalHeightSubtract, setTotalHeightSubtract] = useState(0);
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [openCreateDirectMessageModal, setOpenCreateDirectMessageModal] =
    useState(false);
  const [openSearchRoom, setOpenSearchRoom] = useState(false);

  const SidebarHeaderRef = useRef(0);
  const SidebarBottomRef = useRef(0);

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

  const handleLogout = async () => {
    if (client && userInfo) {
      const resp = putUpdateUserStatus(userInfo?._id, {
        userStatus: enumMemberStatus.OFFLINE,
      });

      if (resp) {
        client.emit("update-user-status", resp);
        localStorage.removeItem("token");
        redirectTo("/");
      }
    }
  };

  const handleClickOpenModalCreateChannel = () => {
    setOpenCreateChannelModal(true);
    setAnchorRoom(null);
  };

  const handleClickOpenModalCreateDirect = () => {
    setOpenCreateDirectMessageModal(true);
    setAnchorRoom(null);
  };

  const handleOpenSearchRoom = () => {
    setOpenSearchRoom(true);
  };

  const handleCloseSearchRoom = () => {
    setOpenSearchRoom(false);
  };

  const handleRedirectToChannelRoom = (channel) => {
    if (typeFeatureRoom) {
      setTypeFeatureRoom(null);
    }
    console.log(channel?._id);
    redirectTo(`/chat/channel/${channel?._id}`);
  };

  const handleRedirectToDirectRoom = (direct) => {
    if (typeFeatureRoom) {
      setTypeFeatureRoom(null);
    }

    redirectTo(`/chat/direct/${direct?._id}`);
  };

  const handleRenderDirectMemberOnSideBar = (direct) => {
    const filterDirectRoom = handleReturnInfoDirectRoom(userInfo, direct);

    return (
      <SidebarBodyItemRooms key={direct?._id}>
        <SidebarBodyItemRoomWrapper
          onClick={() => handleRedirectToDirectRoom(direct)}
        >
          <Box sx={{ display: "flex", align: "center" }}>
            <Box
              sx={{
                width: "40px",
                height: "40px",
                display: "flex",
                borderRadius: "50%",
                position: "relative",
              }}
            >
              {filterDirectRoom?.avatar ? (
                <SidebarBodyItemRoomImage src={filterDirectRoom?.avatar} />
              ) : (
                <AccountCircleIcon sx={{ width: "40px", height: "40px" }} />
              )}
              <SidebarBodyItemRoomStatus
                sx={{ ...handleReturnColorStatus(userInfo), right: !filterDirectRoom?.avatar ? '2px' : '', bottom: !filterDirectRoom?.avatar ? '4px' : '' }}
              />
            </Box>
            <Box sx={{ ml: 2 }}>
              <SidebarBodyItemRoomName sx={{ maxWidth: "140px" }} noWrap>
                {filterDirectRoom?.username || ""}
              </SidebarBodyItemRoomName>
              <SidebarBodyItemRoomMessage sx={{ maxWidth: "140px" }} noWrap>
                Typing..............................................................................
              </SidebarBodyItemRoomMessage>
            </Box>
          </Box>
          <Box>
            <SidebarBodyItemRoomTime>12:00 PM</SidebarBodyItemRoomTime>
          </Box>
        </SidebarBodyItemRoomWrapper>
      </SidebarBodyItemRooms>
    );
  };

  const openAnchorUserInfo = Boolean(anchorUserInfo);
  const openAnchorRoom = Boolean(anchorRoom);

  const idAnchorUserInfo = openAnchorUserInfo
    ? "anchor-user-info-popover"
    : undefined;
  const idAnchorRoom = openAnchorRoom ? "anchor-room-popover" : undefined;

  useEffect(() => {
    (async () => {
      try {
        if (!userInfo) {
          return;
        }
        const payload = {
          organizeId: userInfo?.organizeId,
          orders: {
            updatedAt: order.DESCENDING,
          },
        };

        const respChannels = await getChannelsByUser(userInfo?._id, payload);
        if (Array.isArray(respChannels?.data?.content)) {
          setChannelRooms(respChannels?.data?.content);
        }

        const respDirects = await getDirectsByUserId(userInfo?._id, payload);
        if (Array.isArray(respDirects?.data?.content)) {
          setDirectRooms(respDirects?.data?.content);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, []);

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarHeader ref={SidebarHeaderRef}>
          <SidebarHeaderList>
            <SidebarHeaderItem>
              {userInfo?.avatar ? (
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                  onClick={handleClickOpenAnchorUserInfo}
                >
                  <SidebarHeaderItemImage src={userInfo?.avatar} />
                  <SidebarHeaderItemStatus
                    sx={{ ...handleReturnColorStatus(userInfo) }}
                  ></SidebarHeaderItemStatus>
                </Box>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <AccountCircleIcon
                    sx={{ width: "40px", height: "40px", display: "flex" }}
                    onClick={handleClickOpenAnchorUserInfo}
                  />
                  <SidebarHeaderItemStatus
                    sx={{ ...handleReturnColorStatus(userInfo), right: '2px', bottom: '4px'}}
                  ></SidebarHeaderItemStatus>
                </Box>
              )}
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
                    top: "60px !important",
                  },
                }}
              >
                <SidebarHeaderAnchorUserInfo>
                  <Box>
                    <AnchorUserInfoHeader>
                      {userInfo?.avatar ? (
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        >
                          <AnchorUserInfoHeaderImage src={userInfo.avatar} />
                        </Box>
                      ) : (
                        <AccountCircleIcon
                          sx={{ width: "40px", height: "40px" }}
                        />
                      )}
                      <Box
                        sx={{ display: "flex", flexDirection: "column", ml: 1 }}
                      >
                        <Box sx={flexCenter}>
                          <AnchorUserInfoTitleStatus
                            sx={{ ...handleReturnColorStatus(userInfo) }}
                          ></AnchorUserInfoTitleStatus>
                          <AnchorUserInfoTitleName>
                            {userInfo && userInfo?.username}
                          </AnchorUserInfoTitleName>
                        </Box>
                        <AnchorUserInfoEmail>
                          {userInfo && userInfo?.email}
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

            <SidebarHeaderItem onClick={() => redirectTo("/chat/home")}>
              <HomeIcon sx={{ display: "flex" }} />
            </SidebarHeaderItem>

            <SidebarHeaderItem>
              <SearchIcon
                sx={{ display: "flex" }}
                onClick={() => handleOpenSearchRoom()}
              />
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
                    top: "56px !important",
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
                    {userInfo?.role === enumRoles.PROJECT_MANAGER ? (
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
                        <Box
                          component="h4"
                          sx={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            width: "24px",
                            textAlign: "center",
                          }}
                        >
                          #
                        </Box>
                        <AnchorRoomText>Channel</AnchorRoomText>
                      </Box>
                    ) : null}

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
                <SidebarBodyListRoom>
                  {channelRooms.length > 0 &&
                    channelRooms.map((channel) => {
                      return (
                        <SidebarBodyItemRooms key={channel?._id}>
                          <SidebarBodyItemRoomWrapper
                            onClick={() => handleRedirectToChannelRoom(channel)}
                          >
                            <Box sx={{ display: "flex", align: "center" }}>
                              <Box
                                sx={{
                                  width: "40px",
                                  height: "40px",
                                  display: "flex",
                                  borderRadius: "50%",
                                }}
                              >
                                <SidebarBodyItemRoomImage
                                  src="https://cdnimgen.vietnamplus.vn/uploaded/wbxx/2021_09_09/fourteen_foreign_tv_channels_to_end_broadcast_in_vietnam.jpg"
                                  alt="logo"
                                />
                              </Box>
                              <Box sx={{ ml: 2 }}>
                                <SidebarBodyItemRoomName
                                  sx={{ maxWidth: "140px" }}
                                  noWrap
                                >
                                  {channel?.channelName || ""}
                                </SidebarBodyItemRoomName>
                                <SidebarBodyItemRoomMessage
                                  sx={{ maxWidth: "140px" }}
                                  noWrap
                                >
                                  Typing..............................................................................
                                </SidebarBodyItemRoomMessage>
                              </Box>
                            </Box>
                            <Box>
                              <SidebarBodyItemRoomTime>
                                12:00 PM
                              </SidebarBodyItemRoomTime>
                            </Box>
                          </SidebarBodyItemRoomWrapper>
                        </SidebarBodyItemRooms>
                      );
                    })}
                </SidebarBodyListRoom>
              </SidebarBodyItem>

              <SidebarBodyItem>
                <SidebarBodyItemName>
                  <ArrowDropDownIcon />
                  <SidebarBodyItemNameText>Direct</SidebarBodyItemNameText>
                </SidebarBodyItemName>
                {directRooms?.length > 0 &&
                  directRooms.map((direct) => {
                    return handleRenderDirectMemberOnSideBar(direct);
                  })}
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

      {openSearchRoom ? (
        <SearchRoom closeSearchRoom={handleCloseSearchRoom} />
      ) : null}

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
