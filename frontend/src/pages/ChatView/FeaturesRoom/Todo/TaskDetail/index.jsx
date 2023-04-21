import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
} from '@/shared/components';

import Checkbox from '@mui/material/Checkbox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
  activeColor
} from '@/shared/utils/colors.utils';
import { redirectTo } from '@/shared/utils/history';
import { useRoomStore } from '@/stores/RoomStore';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { postSearchMemberByChannel } from '@/services/channel.services';

const TableCellSearchInput = styled(TextField)`
  ${({ theme: {} }) => css`
    fieldSet {
    }
    &&& {
      background-color: white;
    }
  `}
`;

const flexCenter = {
  display: 'flex',
  alignItems: 'center',
};

export const TaskDetail = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );

  const [members, setMembers] = useState([]);
  const [openTaskDetail, setOpenTaskDetal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keySearch, setKeySearch] = useState();
  const debouncedValue = useDebounce(keySearch, 500);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleSearch = (e) => {
    setKeySearch(e.target.value);
    setLoading(true);
  };

  useEffect(() => {
    setMembers(roomInfo?.membersInChannel);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          username: debouncedValue,
          paging: {},
          userIds: roomInfo?.userIds,
          ownerId: roomInfo?.ownerId,
        };
        const resp = await postSearchMemberByChannel(roomInfo?._id, payload);
        if (resp) {
          setMembers(resp?.data?.content);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedValue]);

  return (
    <Box>
      <Box
        sx={{
          ...flexCenter,
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <AssignmentIcon />
          <Typography ml={0.5} fontWeight="bold">
            Task detail
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          component="label"
          sx={{
            ':hover': {
              color: primaryColor,
            },
          }}
          onClick={() => handleClickCloseMembersPopup()}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxHeight: `calc(100vh - 148px)`, overflowY: 'auto' }}>
        {loading && (
          <Box my={10} textAlign="center">
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}
        {!loading && (
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flex: '0 0 50%', maxWidth: '50%', padding: '8px 16px' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Title
              </Typography>
              <Box sx={{ margin: '16px 0 0 8px' }}>Content</Box>
            </Box>
            <Box
              sx={{
                padding: '8px 16px',
                borderStyle: 'solid none solid solid',
                borderWidth: '1px',
                borderColor: '#fff',
                boxShadow: "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
                flex: '0 0 50%',
                maxWidth: '50%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                height: '100%',
              }}
            >
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Status
                </Typography>
                <Typography ml={1} mt={1} fontSize="12px" color="orange">
                  Not Done
                </Typography>
              </Box>
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Expired date
                </Typography>
                <Typography ml={1} mt={1} fontSize="14px">
                  27/02/2023
                </Typography>
                <Typography ml={1} mt={1} fontSize="14px" color="orange">
                  Remain days: 2 day(s)
                </Typography>
              </Box>
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Assigned to
                </Typography>
                <Box ml={1} mt={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box  sx={{ width: '40px', height: '40px' }}>
                    <img
                      src=""
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Typography sx={{ ml: 0.5 }} fontSize="12px">Nguyen Hai Long</Typography>
                </Box>
              </Box>

              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Actions
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      borderRadius: '5px',
                      background: hoverBackgroundColor,
                      marginTop: '8px',
                      ':hover': {
                        cursor: 'pointer',
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Checkbox />
                    <Typography fontSize="12px">Done</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      marginTop: '8px',
                      background: hoverBackgroundColor,
                      borderRadius: '5px',
                      ':hover': {
                        cursor: 'pointer',
                        opacity: 0.8,
                      },
                    }}
                  >
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <Typography  fontSize="12px">Edit</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
