import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
} from "@/shared/components";

import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";
import { redirectTo } from "@/shared/utils/history";
import { useRoomStore } from "@/stores/RoomStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { postSearchMemberByChannel } from "@/services/channel.services";

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
  display: "flex",
  alignItems: "center",
};

export const Members = () => {
  const roomInfo = useRoomStore((state) => state.roomInfo);
  const setTypeFeatureRoom = useRoomStore((state) => state.setTypeFeatureRoom);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keySearch, setKeySearch] = useState();
  const debouncedValue = useDebounce(keySearch, 500);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/channel/${roomInfo?._id}`);
  };

  const handleSearch = (e) => {
    setKeySearch(e.target.value);
    setLoading(true);
  };

  useEffect(() => {
    setMembers(roomInfo?.membersInChannel)
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          username: debouncedValue,
          paging: {},
          userIds: roomInfo?.userIds,
          ownerId: roomInfo?.ownerId
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
          justifyContent: "space-between",
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <GroupIcon />
          <Typography ml={0.5} fontWeight="bold">
            Channel Information
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          component="label"
          sx={{
            ":hover": {
              color: primaryColor,
            },
          }}
          onClick={() => handleClickCloseMembersPopup()}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ padding: 2, borderBottom: `1px solid ${borderColor}` }}>
        <TableCellSearchInput
          placeholder="Search"
          fullWidth
          //   name={fieldName}
          size="small"
          value={keySearch}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ maxHeight: `calc(100vh - 220px)`, overflowY: "auto" }}>
        {loading && (
          <Box my={10} textAlign="center">
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}
        {!loading &&
          members?.map((member) => {
            return (
              <Box
                sx={{
                  ...flexCenter,
                  justifyContent: "space-between",
                  padding: 2,
                  borderBottom: `1px solid ${borderColor}`,
                  ":hover": {
                    backgroundColor: hoverTextColor,
                    cursor: "pointer",
                  },
                }}
                onClick={() => redirectTo(`/chat/channel/:id/threads/123`)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <img
                      src={member?.avatar}
                      alt=""
                      width={40}
                      height={40}
                      style={{ objectFit: "contain", borderRadius: "10px" }}
                    />
                  </Box>
                  <Box ml={1}>
                    <Typography fontSize="15px">{member?.username}</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
