import React, { useState } from "react";

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
  StyledSelectItemText,
  StyledChipContainer,
} from "./SelectMultipleInput.styles";
import { handleEmailToName } from "@/shared/utils/utils";
import { selectedColor, whiteColor } from "@/shared/utils/colors.utils";
import { CircularProgress } from "@mui/material";

export const SelectMultipleInput = ({
  width = 568,
  dataList = [],
  keyId = "id",
  keyValue = "username",
  dataSelected = [],
  handleSelectedMember,
  handleUnSelectedMember,
  onOpenDropdown,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isSelected = (item) =>
    dataSelected?.map((item) => item[keyId])?.includes(item[keyId]);

  const handleOpenDropdown = async (event) => {
    setAnchorEl(event?.currentTarget);
    !!onOpenDropdown && onOpenDropdown();
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledSelectMultipleContainer>
        <StyledTextField
          onClick={handleOpenDropdown}
          fullWidth
          inputProps={{
            readOnly: true,
          }}
          InputProps={{
            startAdornment: (
              <StyledChipContainer>
                {dataSelected?.map((item, index) => {
                  return (
                    <Chip
                      size="small"
                      key={item[keyId] || index}
                      tabIndex={-1}
                      sx={{ mx: 1, my: 0.5 }}
                      label={item?.email}
                      avatar={<Avatar alt="Natacha" src={item?.avatar || ""} />}
                      onDelete={() => handleUnSelectedMember(item)}
                    />
                  );
                })}
              </StyledChipContainer>
            ),
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
          {dataList?.length < 1 && !loading && (
            <StyledSelectMultipleContentItem>
              Empty
            </StyledSelectMultipleContentItem>
          )}
          {!loading &&
            dataList?.length > 0 &&
            dataList.map((item) => {
              return (
                <StyledSelectMultipleContentItem
                  key={item?.id}
                  onClick={() =>
                    !!handleSelectedMember && handleSelectedMember(item)
                  }
                  sx={{
                    backgroundColor: isSelected(item)
                      ? selectedColor
                      : whiteColor,
                  }}
                >
                  <StyledItemImageWrapper>
                    <StyledSelectItemImage
                      src={item?.avatar || ""}
                      alt="avatar"
                    />
                  </StyledItemImageWrapper>
                  <StyledSelectItemText>
                    {handleEmailToName(item?.email) || "unknown"}
                  </StyledSelectItemText>
                </StyledSelectMultipleContentItem>
              );
            })}
          {loading && (
            <StyledSelectMultipleContentItem
              sx={{ justifyContent: "center", height: 100 }}
            >
              <CircularProgress sx={{ color: "black" }} />
            </StyledSelectMultipleContentItem>
          )}
        </StyledSelectMultipleDropdownContainer>
      </StyledSelectMultipleMenu>
    </>
  );
};
