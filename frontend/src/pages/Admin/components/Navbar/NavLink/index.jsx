import React from 'react';
import { NavLink } from "react-router-dom";
import { NavLinkWrapper, NavLinkTitle } from './NavLink.styles';

export const NavLinkCustomize = ({ to, icon, title }) => {

    return (
        <NavLink to={to}>
            <NavLinkWrapper>
                {icon}
                <NavLinkTitle>{title}</NavLinkTitle>
            </NavLinkWrapper>
        </NavLink>
    )
}