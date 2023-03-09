import React, { useState } from "react";

import { StyledTextField } from "@/shared/components/TextField";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

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

  const handleOpenDropdown = async (event) => {
    setAnchorEl(event?.currentTarget);
    !!onOpenDropdown && onOpenDropdown();
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const onClickSelectedMember = (item) => {
    console.log(!!handleSelectedMember);
    !!handleSelectedMember && handleSelectedMember(item); 
  }

  return (
    <>
      <StyledSelectMultipleContainer onClick={handleOpenDropdown}>
        <StyledTextField
          fullWidth
          InputProps={{
            startAdorment: dataSelected?.map((item) => {
              return (
                <Chip
                  key={item}
                  tabIndex={-1}
                  label={item?.email}
                  avatar={<Avatar alt="Natacha" src="" />}
                  onDelete={handleUnSelectedMember(item)}
                />
              );
            }),
          }}
        />
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
                  onClick={() => onClickSelectedMember(item)}
                >
                  <StyledItemImageWrapper>
                    <StyledSelectItemImage src="" />
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
