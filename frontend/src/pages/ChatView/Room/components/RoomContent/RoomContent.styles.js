import styled, { css } from "styled-components";
import { Box, Typography, Avatar } from "@/shared/components";
import {
  inActiveColor,
  whiteColor,
  hoverTextColor,
  borderColor,
  primaryColor
} from "@/shared/utils/colors.utils";

export const RoomContentContainer = styled(Box)``;

export const MessageList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MessageItem = styled(Box)`
  display: flex;
  padding: 8px 0px 8px 24px;
  position: relative;

  &:hover {
    cursor: pointer;
    background-color: ${hoverTextColor};
  }
`;

export const UserImageWrapper = styled(Box)``;

export const UserImage = styled(Avatar)`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export const MessageContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  width: 100%;
`;

export const MessageTitle = styled(Box)`
  display: flex;
  align-items: center;
`;

export const UserName = styled(Typography)`
  ${() => css`
    &&& {
      font-size: 15px;
      font-weight: bold;
    }
  `}
`;

export const TimeMessage = styled(Typography)`
  ${() => css`
    &&& {
      font-size: 12px;
      color: ${inActiveColor};
      margin-left: 8px;
    }
  `}
`;

export const MessageContentBox = styled(Box)`
  white-space: break-spaces;
  overflow-wrap: anywhere;
  font-size: 15px; 
`;

export const MessageQuoteBox = styled(Box)`
  border-style: solid;
  border-width: 1px 1px 1px 2px;
  border-color: ${borderColor} ${borderColor} ${borderColor} ${primaryColor};
  padding: 8px 16px;
  width: 100%;
  margin-top: 8px;
`
export const MessageReactionBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`

export const MessageThreadBox = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

export const MessageReplyContent = styled(Typography)`
  ${() => css`
    &&& {
      font-size: 15px;
    }
  `}
`;

export const InteractMessageWrapper = styled(Box)`
  position: absolute;
  border-radius: 10px;
  border: 2px solid #f8efef;
  background-color: ${whiteColor};
  top: -20px;
  right: 10px;
`;
