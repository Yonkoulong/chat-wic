import {
  DialogContentText,
  Button,
  Typography,
  Menu,
  Box,
} from "@/shared/components";
import styled, { css } from "styled-components";
import { hoverTextColor } from "@/shared/utils/colors.utils";

export const StyledSelectMultipleContainer = styled(Box)`
  width: 100%;
`;

export const StyledSelectMultipleMenu = styled(Menu)``;

export const StyledSelectMultipleDropdownContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  width: 100%;
  overflow-y: auto;
`;

export const StyledSelectMultipleContentItem = styled(Box)`
  width: 100%;
  padding: 4px 16px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${hoverTextColor};
    cursor: pointer;
  }
`;

export const StyledItemImageWrapper = styled(Box)`
  width: 32px;
  height: 32px;
  border: 1px solid;
`;

export const StyledSelectItemImage = styled("img")`
  width: 100%;
  object-fit: contain;
`;

export const StyledSlectItemText = styled(Typography)`
  ${() => css`
    &&& {
      margin-left: 8px;
    }
  `}
`;
