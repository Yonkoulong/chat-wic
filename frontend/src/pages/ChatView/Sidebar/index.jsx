import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MessageIcon from "@mui/icons-material/Message";

import {
  SidebarContainer,
  SidebarWrapper,
  SidebarHeader,
  SidebarHeaderList,
  SidebarHeaderItem,
  SidebarBody,
  SidebarBodyWrapper,
  SidebarBodyList,
  SidebarBodyItem,
  SidebarBodyItemName,
  SidebarBodyItemNameText,
  SidebarBodyItemRooms,
  SidebarBodyItemRoomWrapper,
  SidebarBodyItemRoomImage,
  SidebarBodyItemRoomName,
  SidebarFooter,
  SidebarFooterWrapper,
  SidebarFooterContent,
  SidebarFooterText
} from "./Sidebar.styles";

const Sidebar = () => {
  const [anchorUserInfo, setAnchorUserInfo] = useState(null);

  const handleClickOpenAnchorUserInfo = () => {
    setAnchorUserInfo(true);
  };

  const handleCloseAnchorUserInfo = () => {
    setAnchorUserInfo(false);
  };

  const openAchorUserInfo = Boolean(anchorUserInfo);
  const id = open ? "user-popover" : undefined;

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarHeader>
          <SidebarHeaderList>
            <SidebarHeaderItem>
              icon
              <Popover
                id={id}
                open={openAchorUserInfo}
                anchorEl={anchorUserInfo}
                onClose={handleCloseAnchorUserInfo}
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
          <SidebarBodyWrapper>
            <SidebarBodyList>
              <SidebarBodyItem>
                <SidebarBodyItemName>
                  <ArrowDropDownIcon />
                  <SidebarBodyItemNameText>Channels</SidebarBodyItemNameText>
                </SidebarBodyItemName>
                <SidebarBodyItemRooms>
                  <SidebarBodyItemRoomWrapper>
                    <SidebarBodyItemRoomImage />
                    <SidebarBodyItemRoomName>User-1</SidebarBodyItemRoomName>
                  </SidebarBodyItemRoomWrapper>
                </SidebarBodyItemRooms>
              </SidebarBodyItem>
              <SidebarBodyItem>
                <SidebarBodyItemName>
                  <ArrowDropDownIcon />
                  <SidebarBodyItemNameText>Direct</SidebarBodyItemNameText>
                </SidebarBodyItemName>
                <SidebarBodyItemRooms></SidebarBodyItemRooms>
              </SidebarBodyItem>
            </SidebarBodyList>
          </SidebarBodyWrapper>
        </SidebarBody>

        <SidebarFooter>
          <SidebarFooterWrapper>
            <MessageIcon />
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