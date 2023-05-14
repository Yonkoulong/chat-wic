import styled, { css } from "styled-components";
import { Box, Typography } from "@/shared/components";
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
  gap: 16px;
`;

export const MessageItem = styled(Box)`
  display: flex;
  padding: 8px 0px 8px 24px;
  position: relative;

  &:hover {
    background-color: ${hoverTextColor};
  }
`;

export const UserImageWrapper = styled(Box)`
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const UserImage = styled('img')`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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
  margin-top: 8px;
  width: fit-content;
  border-radius: 5px;
  border: 1px solid ${borderColor};
  background-color: ${hoverTextColor};

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
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
