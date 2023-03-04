import React from "react";
import PieChartSharpIcon from "@mui/icons-material/PieChartSharp";
import GroupIcon from "@mui/icons-material/Group";
import {
  NavbarStyled,
  NavbarListStyled,
  NavbarItemStyled,
} from "./Navbar.styles";
import { NavLinkCustomize } from "./NavLink";

const navList = [
  {
    to: "/admin/dashboard",
    icon: <PieChartSharpIcon />,
    title: "Dashboard",
  },
  {
    to: "/admin/members",
    icon: <GroupIcon />,
    title: "Members",
  },
];

export const Navbar = () => {
  return (
    <NavbarStyled>
      <NavbarListStyled>
        {navList.length > 0 &&
          navList.map((item, index) => {
           return (
            <NavbarItemStyled key={index}>
              <NavLinkCustomize
                to={item.to}
                icon={item.icon}
                title={item.title}
              />
            </NavbarItemStyled>
           ) 
        })}
      </NavbarListStyled>
    </NavbarStyled>
  );
};
