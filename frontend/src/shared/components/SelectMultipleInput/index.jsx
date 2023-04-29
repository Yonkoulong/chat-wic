import React, { useState } from "react";
import Chip from "@mui/material/Chip";

import { Box } from "@/shared/components";
import {
  StyledSelectMultipleContainer,
  StyledSelectMultipleMenu,
  StyledSelectMultipleDropdownContainer,
  StyledSelectMultipleContentItem,
  StyledItemImageWrapper,
  StyledSelectItemImage,
  StyledSelectItemText,
  StyledChipContainer,
  StyledOutlineInput,
} from "./SelectMultipleInput.styles";
import { handleEmailToName } from "@/shared/utils/utils";
import { selectedColor, whiteColor } from "@/shared/utils/colors.utils";
import { CircularProgress } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const SelectMultipleInput = ({
  width = 568,
  dataList = [],
  keyId = "id",
  keyValue = "username",
  dataSelected = [],
  handleSelectedMember,
  handleUnSelectedMember,
  handleSearch,
  onOpenDropdown,
  loading = false,
  placeholder = "Enter",
  inputFocusRef,
  field,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const isSelected = (item) =>
    dataSelected?.map((item) => item[keyId])?.includes(item[keyId]);

  const handleOpenDropdown = async (event) => {
    setAnchorEl(event?.currentTarget);
    !!onOpenDropdown && onOpenDropdown();
  };

  const handleSearchMultipleItem = (e) => {
    if (e.target.value != "") {
      handleSearch(e);
      if (!open) {
        console.log(open);
        setAnchorEl(e?.currentTarget);
      }
    }
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledSelectMultipleContainer>
        <StyledOutlineInput
          ref={inputFocusRef}
          onChange={(e) => handleSearchMultipleItem(e)}
          onClick={handleOpenDropdown}
          fullWidth
          sx={{
            "& input": {
              width: "unset",
            },
          }}
          size="small"
          type="text"
          placeholder={placeholder}
          startAdornment={
            <StyledChipContainer>
              {dataSelected?.map((item, index) => {
                return (
                  <Chip
                    size="small"
                    key={item[keyId] || index}
                    tabIndex={-1}
                    sx={{ mx: 1, my: 0.5 }}
                    label={item?.email}
                    avatar={
                      item?.avatar ? (
                        <Box sx={{ width: "30px", height: "30px" }}>
                          <img
                            alt="logo"
                            src={item?.avatar}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ) : (
                        <AccountCircleIcon />
                      )
                    }
                    onDelete={() => handleUnSelectedMember(item)}
                  />
                );
              })}
            </StyledChipContainer>
          }
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
                    {item?.avatar ? (
                      <StyledSelectItemImage
                        src={item?.avatar}
                        alt="avatar"
                      />
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </StyledItemImageWrapper>
                  <StyledSelectItemText>
                    {item?.username || ""}
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
