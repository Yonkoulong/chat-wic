import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@/shared/components";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
  activeColor,
} from "@/shared/utils/colors.utils";
import { redirectTo } from "@/shared/utils/history";
import { formatDate, enumRoles, taskStatus } from "@/shared/utils/constant";
import { hanldeReturnStatusTask } from "@/shared/utils/utils";

import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";

import { getTaskDetail, putUpdateTask } from "@/services/task.services";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const TaskDetail = () => {
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );
  const { userInfo } = useAppStore((state) => state);
  const { id, taskId } = useParams();

  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleCalulateTime = () => {
    const now = new Date();

    if (taskDetail?.endDate) {
      const endTime = new Date(taskDetail?.endDate);
      const remainingTime = now - endTime;

      if (remainingTime > 0) {
        return (
          <Typography ml={1} mt={1} fontSize="14px" color="error">
            Overdue {Math.ceil(remainingTime / (1000 * 60 * 60 * 24))}{" "}
            day(s)
          </Typography>
        );
      } else {
        return (
          <Typography ml={1} mt={1} fontSize="14px" color="orange">
            Remain days: {Math.ceil(Math.abs(remainingTime / (1000 * 60 * 60 * 24)))}{" "}
            day(s)
          </Typography>
        );
      }
    }
  };

  const handleUpdateStatusTask = async() => {
    try {
      const newPayload = {
        status: taskDetail?.status === taskStatus.DONE ? taskStatus.NOT_DONE : taskStatus.DONE,
      }

      const resp = await putUpdateTask(taskId, newPayload);
      if(resp) {
        const fetchTaskDetail = await getTaskDetail(taskId);
        setTaskDetail(fetchTaskDetail?.data?.content);
      }
    } catch (error) {
      throw error
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await getTaskDetail(taskId);
        if (resp) {
          setTaskDetail(resp?.data?.content);
        }
      } catch (error) {
        throw error;
      }
    })();
  }, []);

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
          <IconButton
            onClick={() => redirectTo(`/chat/channel/${id}/todo-list`)}
            color="primary"
          >
            <KeyboardReturnIcon />
          </IconButton>
          <Typography ml={0.5} fontWeight="bold">
            Task detail
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

      <Box sx={{ maxHeight: `calc(100vh - 148px)`, overflowY: "auto" }}>
        {loading && (
          <Box my={10} textAlign="center">
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}
        {!loading && (
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ flex: "0 0 50%", maxWidth: "50%", padding: "8px 16px" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                {taskDetail?.title || ""}
              </Typography>
              <Box sx={{ margin: "16px 0 0 8px" }}>
                {taskDetail?.content || ""}
              </Box>
            </Box>
            <Box
              sx={{
                padding: "8px 16px",
                borderStyle: "solid none solid solid",
                borderWidth: "1px",
                borderColor: "#fff",
                boxShadow:
                  "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
                flex: "0 0 50%",
                maxWidth: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                height: "100%",
              }}
            >
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Status
                </Typography>
                {userInfo?._id === taskDetail?.assigneeInfo?._id ? (
                  <FormGroup ml={1} mt={1}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={taskDetail?.status === taskStatus.DONE} onChange={() => handleUpdateStatusTask()}/>}
                      label={
                        <Typography fontSize="12px">
                          {hanldeReturnStatusTask(taskDetail?.status)}
                        </Typography>
                      }
                    />
                  </FormGroup>
                ) : (
                  <Typography ml={1} mt={1} fontSize="12px">
                    {hanldeReturnStatusTask(taskDetail?.status)}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Expired date
                </Typography>
                <Typography ml={1} mt={1} fontSize="14px">
                  {formatDate(taskDetail?.endDate) || ""}
                </Typography>
                {handleCalulateTime()}
              </Box>
              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Assigned to
                </Typography>
                <Box
                  ml={1}
                  mt={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {taskDetail?.assigneeInfo?.avatar ? (
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    >
                      <img
                        src={taskDetail?.assigneeInfo?.avatar}
                        alt="image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  ) : (
                    <AccountCircleIcon />
                  )}

                  <Typography sx={{ ml: 0.5 }} fontSize="12px">
                    {taskDetail?.assigneeInfo?.username || ""}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography fontSize="15px" fontWeight="bold">
                  Actions
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {userInfo?.role === enumRoles?.PROJECT_MANAGER && (
                    <>
                      <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
