import React, { useRef, useState } from "react";

import { StyledTextField } from "@/shared/components/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import {
  StyledSelectMultipleContainer,
  StyledSelectMultipleMenu,
  StyledSelectMultipleDropdownContainer,
  StyledSelectMultipleContentItem,
  StyledItemImageWrapper,
  StyledSelectItemImage,
  StyledSlectItemText,
} from "./SelectMultipleInput.styles";
import { handleEmailToName } from "@/shared/utils/utils";
import { hoverTextColor, whiteColor } from "@/shared/utils/colors.utils";

export const SelectMultipleInput = ({
  width = 568,
  dataList = [],
  keyId = "_id",
  keyValue = "username",
  dataSelected = [],
  handleSelectedMember,
  handleUnSelectedMember,
  onOpenDropdown,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const searchRef = useRef();

  const isSelected = (item) =>
    dataSelected?.map((item) => item[keyId])?.includes(item[keyId]);

  const handleOpenDropdown = async (event) => {
    setAnchorEl(event?.currentTarget);
    searchRef?.current?.focus();
    !!onOpenDropdown && onOpenDropdown();
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledSelectMultipleContainer onClick={handleOpenDropdown}>
        <StyledTextField
          fullWidth
          ref={searchRef}
          readOnly
          InputProps={{
            startAdornment: dataSelected?.map((item) => {
              return (
                <Chip
                  key={item}
                  tabIndex={-1}
                  label={item?.email}
                  avatar={<Avatar alt="Natacha" src="" />}
                  onDelete={() => handleUnSelectedMember(item)}
                />
              );
            }),
          }}
        />
      </StyledSelectMultipleContainer>
      <StyledSelectMultipleMenu
        disableEnforceFocus
        disableRestoreFocus={false}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: {
            width,
            marginLeft: 2,
            transform: "translateX(0px) translateY(10px)",
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
                  <StyledSelectMultipleContentItem
                    key={item?.id}
                    onClick={() => !!handleSelectedMember && handleSelectedMember(item)}
                    sx={{
                      backgroundColor: isSelected(item)
                        ? hoverTextColor
                        : whiteColor,
                    }}
                  >
                    <StyledItemImageWrapper>
                      <StyledSelectItemImage
                        src={item?.avatar || ""}
                        alt="avatar"
                      />
                    </StyledItemImageWrapper>
                    <StyledSlectItemText>
                      {handleEmailToName(item?.email) || "unknown"}
                    </StyledSlectItemText>
                  </StyledSelectMultipleContentItem>
                );
              })}
          </StyledSelectMultipleDropdownContainer>
      </StyledSelectMultipleMenu>
    </>
  );
};
