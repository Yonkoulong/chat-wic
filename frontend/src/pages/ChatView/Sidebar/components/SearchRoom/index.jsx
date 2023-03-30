import React, { useState, useEffect } from 'react';

import { Box, TextField, InputAdornment } from '@/shared/components';
import CloseIcon from '@mui/icons-material/Close';

import {
  SearchRoomContainer,
  SearchRoomHeader,
  SearchRoomBody,
  SearchRoomBodyWrapper,
  ImageSearchStyled,
  SearchRoomStatus,
  SearchRoomName,
} from './SearchRoom.styles';

import {
  blackColor,
  borderColor,
  whiteColor,
  hoverItemSidebarColor,
  textColorItemSidebar,
} from '@/shared/utils/colors.utils';

import { useDebounce } from '@/shared/hooks';

export const SearchRoom = ({ closeSearchRoom }) => {
  const [searchKey, setSearchKey] = useState('');
  const [isChangeSearchKey, setIsChangeSearchKey] = useState(false);
  const debounceSearchKey = useDebounce(searchKey);

  const handleChangeSeachKey = (event) => {
    setIsChangeSearchKey(true);
    setSearchKey(event.target?.value);
  };

  const handleSearch = () => {
    
  };

  const handleClickRoomSearched = () => {

  }

  useEffect(() => {
    if (isChangeSearchKey) {
      handleSearch(searchKey, fieldName);
    }
  }, [debounceSearchKey]);

  return (
    <SearchRoomContainer>
      <SearchRoomHeader>
        <Box>
          <TextField
            sx={{
              '.MuiInputBase-root': {
                border: `0.1px solid ${borderColor}`,
              },
              '.MuiInputBase-input': {
                color: whiteColor,
                fontSize: '12px'
              },
            }}
            placeholder="Search room, member name"
            fullWidth
            name="room"
            size="small"
            value={searchKey}
            onChange={handleChangeSeachKey}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                  <CloseIcon fontSize="small" sx={{ color: whiteColor }} onClick={() => closeSearchRoom()}/>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </SearchRoomHeader>
      <SearchRoomBody>
        <SearchRoomBodyWrapper>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              columnGap: '4px',
              '&:hover': {
                backgroundColor: hoverItemSidebarColor,
                cursor: 'pointer'
              }
            }}
            onClick={() => handleClickRoomSearched(room)}
          >
            <Box sx={{ width: '32px', height: '32px', border: '1px solid' }}>
              <ImageSearchStyled src="" />
            </Box>
            <SearchRoomStatus></SearchRoomStatus>
            <SearchRoomName>long ne</SearchRoomName>
          </Box>     
          
        </SearchRoomBodyWrapper>
      </SearchRoomBody>
    </SearchRoomContainer>
  );
};
