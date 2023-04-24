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

import AssignmentIcon from "@mui/icons-material/Assignment";
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
import { hanldeReturnStatusTask } from "@/shared/utils/utils"
import { formatDate } from "@/shared/utils/constant";
import { useRoomStore } from "@/stores/RoomStore";
import { useTaskStore } from "@/stores/TaskStore";
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

export const Tasks = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );
  const { fetchTasksByChannel, tasks } = useTaskStore((state) => state);

  const [members, setMembers] = useState([]);
  const [openTaskDetail, setOpenTaskDetal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keySearch, setKeySearch] = useState();
  const debouncedValue = useDebounce(keySearch, 500);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleRedirectToTaskDetail = (taskId) => {
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}/todo-detail/${taskId}`);
  }

  const handleSearch = (e) => {
    setKeySearch(e.target.value);
    setLoading(true);
  };

  const handleOpenTaskDetailModal = (e) => {
    setOpenTaskDetal(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetchTasksByChannel(roomInfo?._id, {});
      } catch (error) {
        throw error;
      }

    })();

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
          justifyContent: "space-between",
          padding: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={flexCenter}>
          <AssignmentIcon />
          <Typography ml={0.5} fontWeight="bold">
            To-Do
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
          tasks?.map((task) => {
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
                key={task?._id}
                onClick={() => handleRedirectToTaskDetail(task?._id)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography fontSize="15px" fontWeight="bold">
                      {task?.title || ''}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: inActiveColor, width: "130px" }} noWrap={true}>
                      {task?.content || ''}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize="15px" fontWeight="bold">
                      Deadline: <span style={{ color: inActiveColor, fontWeight: "normal", fontSize: '12px' }}>{formatDate(task?.endDate)}</span>
                    </Typography>
                    <Typography fontSize="15px" fontWeight="bold">
                      Status:{" "}
                      <span style={{ color: inActiveColor, fontWeight: "normal", fontSize: '12px'}}>
                        {hanldeReturnStatusTask(task?.status)}
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
