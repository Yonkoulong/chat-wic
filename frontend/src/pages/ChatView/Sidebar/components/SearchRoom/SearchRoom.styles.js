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
  object-fit: contain;
`;

export const SearchRoomStatus = styled(Box)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid;
`;

export const SearchRoomName = styled(Typography)`
  color: ${whiteColor};
`;
