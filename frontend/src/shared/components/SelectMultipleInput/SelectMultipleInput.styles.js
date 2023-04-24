import {
  Typography,
  Menu,
  Box,
  OutlinedInput,
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledSelectItemImage = styled('img')`
  &&& {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const StyledSelectItemText = styled(Typography)`
  ${() => css`
    &&& {
      margin-left: 8px;
    }
  `}
`;

export const StyledChipContainer = styled(Box)`
  ${() => css`
    display: flex;
    max-width: max-content;
    width: 100%;
    flex-wrap: wrap;
  `}
`;

export const StyledOutlineInput = styled(OutlinedInput)`
  ${() => css``}
`;
