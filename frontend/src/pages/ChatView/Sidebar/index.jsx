import React, { useState, useEffect, useRef } from "react";
import Popover from "@mui/material/Popover";

import { Box, Typography } from '@/shared/components';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MessageIcon from "@mui/icons-material/Message";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import PersonIcon from "@mui/icons-material/Person";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

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
  SidebarHeaderAnchorUserInfoWrapper,
  AnchorUserInfoHeader,
  AnchorUserInfoHeaderImage,
  AnchorUserInfoHeaderContent,
  AnchorUserInfoTitle,
  AnchorUserInfoTitleStatus,
  AnchorUserInfoTitleName,
  AnchorUserInfoEmail,
  AnchorUserInfoBody,
  AnchorUserInfoBodyTitle,
  AnchorUserInfoBodyStatus,
  AnchorUserInfoBodyText,
  AnchorUserInfoBottom,
  AnchorUserInfoBottomList,
  AnchorUserInfoBottomItem,
  AnchorUserInfoBottomItemText,
} from "./Sidebar.styles";

const flexCenter = { display: "flex", alignItems: "center" };

const Sidebar = () => {
  const [anchorUserInfo, setAnchorUserInfo] = useState(null);
  const [anchorRoom, setAnchorRoom] = useState(null);
  const [totalHeightSubtract, setTotalHeightSubtract] = useState(0);

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

  const openAnchorUserInfo = Boolean(anchorUserInfo);
  const openAnchorRoom = Boolean(anchorRoom);

  const idAnchorUserInfo = openAnchorUserInfo
    ? "anchor-user-info-popover"
    : undefined;
  const idAnchorRoom = openAnchorRoom ? "ancho-room-popover" : undefined;

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
              >
                <SidebarHeaderAnchorUserInfo>
                  <Box>
                    <AnchorUserInfoHeader>
                      <AnchorUserInfoHeaderImage src="/" />
                      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1}}>
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
                      <Box>
                        <Box>
                          <AnchorUserInfoBodyStatus></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>
                            online
                          </AnchorUserInfoBodyText>
                        </Box>
                        <Box>
                          <AnchorUserInfoBodyStatus></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>Busy</AnchorUserInfoBodyText>
                        </Box>
                        <Box>
                          <AnchorUserInfoBodyStatus></AnchorUserInfoBodyStatus>
                          <AnchorUserInfoBodyText>
                            offline
                          </AnchorUserInfoBodyText>
                        </Box>
                      </Box>
                    </AnchorUserInfoBody>

                    <AnchorUserInfoBottom>
                      <Box>
                        <Box sx={flexCenter}>
                          <PersonIcon />
                          <AnchorUserInfoBottomItemText>
                            My account
                          </AnchorUserInfoBottomItemText>
                        </Box>
                        <Box sx={flexCenter}>
                          <GridViewIcon />
                          <AnchorUserInfoBottomItemText>
                            Admin management
                          </AnchorUserInfoBottomItemText>
                        </Box>
                        <Box sx={flexCenter}>
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
              >
                content
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
                  <SidebarBodyItemRoomWrapper>
                    <SidebarBodyItemRoomImage />
                    <SidebarBodyItemRoomStatus></SidebarBodyItemRoomStatus>
                    <SidebarBodyItemRoomName>User-1</SidebarBodyItemRoomName>
                  </SidebarBodyItemRoomWrapper>
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
    </SidebarContainer>
  );
};

export default Sidebar;
