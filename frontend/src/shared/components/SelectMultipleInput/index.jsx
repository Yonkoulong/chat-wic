import React, { useState } from "react";
import {
  StyledSelectMultipleContainer,
  StyledSelectMultipleMenu,
  StyledSelectMultipleDropdownContainer,
  StyledSelectMultipleContentItem,
} from "./SelectMultipleInput.styles";

export const SelectMultipleInput = ({
  width = 580,
  dataList = [],
  keyId = "_id",
  keyValue = "username",
  dataSelected = [],
  onOpenDropdown
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenDropdown = async (event) => {
    setAnchorEl(event?.currentTarget);
    !!onOpenDropdown && onOpenDropdown();
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StyledSelectMultipleContainer onClick={handleOpenDropdown}>
        SelectMultipleInput
      </StyledSelectMultipleContainer>
      <StyledSelectMultipleMenu
        disableEnforceFocus
        disableRestoreFocus
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: {
            width,
            marginLeft: 2,
            transform: "translateX(0px) translateY(-250px)",
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseDropdown}
      >
        <StyledSelectMultipleDropdownContainer>
          {Array.isArray(dataList) &&
            dataList.map((item) => {
              return (
                <StyledSelectMultipleContentItem key={item[keyId]}>
                  {item[keyValue] || ""}
                </StyledSelectMultipleContentItem>
              );
            })}
        </StyledSelectMultipleDropdownContainer>
      </StyledSelectMultipleMenu>
    </>
  );
};
