import styled, { css } from 'styled-components';
import { Box, Typography } from '@/shared/components';
import {
  blackColor,
  borderColor,
  whiteColor,
  hoverItemSidebarColor,
  textColorItemSidebar,
} from '@/shared/utils/colors.utils';

export const SearchRoomContainer = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #2f343d;
`;

export const SearchRoomHeader = styled(Box)`
  padding: 16px;
  border-bottom: 1px solid ${borderColor};
`;

export const SearchRoomBody = styled(Box)`
    margin: 4px 0px;
`;

export const SearchRoomBodyWrapper = styled(Box)`
  max-height: calc(100vh - 73px);

  ${() => css`
    &&& {
      overflow: auto;

      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        display: none;
      }
    }
  `}
`;

export const ImageSearchStyled = styled('img')`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const SearchRoomStatus = styled(Box)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const SearchRoomName = styled(Typography)`

  ${() => css`
    &&& {
      color: ${whiteColor};
      font-size: 14px;
      margin-left: 4px;
    }
  `}

`;
