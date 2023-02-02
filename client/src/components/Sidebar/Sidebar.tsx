import React from "react";

import {
  SidebarContainer,
  SiderbarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarHeaderList,
  SidebarHeaderItem,
} from "./Sidebar.styles";

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <SiderbarHeader>
        <SidebarHeaderList>
          <SidebarHeaderItem></SidebarHeaderItem>
        </SidebarHeaderList>
      </SiderbarHeader>
      <SidebarMain></SidebarMain>
      <SidebarFooter></SidebarFooter>
    </SidebarContainer>
  );
};
