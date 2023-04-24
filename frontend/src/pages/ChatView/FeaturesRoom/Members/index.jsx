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
  Button,
} from "@/shared/components";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  primaryColor,
  borderColor,
  inActiveColor,
  hoverBackgroundColor,
  hoverTextColor,
} from "@/shared/utils/colors.utils";
import { redirectTo } from "@/shared/utils/history";
import { enumPopupFeatures, enumRoles } from "@/shared/utils/constant";

import { useRoomStore } from "@/stores/RoomStore";
import { useAppStore } from "@/stores/AppStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { postSearchMemberByChannel } from "@/services/channel.services";
import { PopUpConfirm } from '@/shared/components/PopUp';
import { ModalAddUser } from "@/pages/ChatView/Components/Modal";

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
  const { userInfo } = useAppStore((state) => state);
  const { roomInfo, typeRoom, setTypeFeatureRoom } = useRoomStore(
    (state) => state
  );

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keySearch, setKeySearch] = useState();
  const [idMemberDelete, setIsMemberDelete] = useState(null);
  const [isHoverMember, setIsHoverMember] = useState(null);
  const [heightMembers, setHeightMembers] = useState(220);
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);

  const debouncedValue = useDebounce(keySearch, 500);

  const handleClickCloseMembersPopup = () => {
    setTypeFeatureRoom(null);
    redirectTo(`/chat/${typeRoom}/${roomInfo?._id}`);
  };

  const handleSearch = (e) => {
    setKeySearch(e.target.value);
    setLoading(true);
  };

  const handleRedirecToMemberDetailPopup = (member) => {
    redirectTo(
      `/chat/channel/${roomInfo?._id}/${enumPopupFeatures.USER_INFO}/${member?._id}`
    );
  };

  const handleMouseOver = (member) => {
    setIsHoverMember(member);
  };

  const handleMouseOut = () => {
    setIsHoverMember(null);
  };

  const handleRemoveMemberFromChannel = async () => {
    if(idMemberDelete) {
      try {
        
      } catch (error) {
        throw error;
      }
    }
  };

  const handleClosePopupDeleteMember = () => {
    setOpenPopupConfirm(false)
  }

  const handleClickOpenPopupDeleteMember = (e, member) => {
    e.stopPropagation();
    setOpenPopupConfirm(true);
    setIsMemberDelete(member?._id);
  }

  const handleClickOpenModalAddMembers = () => {
    setOpenAddUserModal(true);
  }

  useEffect(() => {
    setMembers(roomInfo?.membersInChannel);

    if(userInfo?.role === enumRoles?.PROJECT_MANAGER) {
      setHeightMembers(275);
    }
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
    <Box sx={{ position: "relative", height: "100%" }}>
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
            Members
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

      <Box sx={{ maxHeight: `calc(100vh - ${heightMembers}px)`, overflowY: "auto" }}>
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
                key={member?._id}
                onMouseOver={() => handleMouseOver(member)}
                onMouseOut={handleMouseOut}
                onClick={() => handleRedirecToMemberDetailPopup(member)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {member?.avatar ? (
                    <Box sx={{ width: "40px", height: "40px" }}>
                      <img
                        src={member?.avatar}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  ) : (
                    <AccountCircleIcon fontSize="large" />
                  )}

                  <Box ml={1}>
                    <Typography fontSize="15px">{member?.username}</Typography>
                  </Box>

                  {isHoverMember?._id === member?._id &&
                    userInfo?._id === roomInfo?.ownerId && (
                      <IconButton
                        sx={{ position: "absolute", right: 0 }}
                        color="primary"
                        onClick={(e) =>
                          handleClickOpenPopupDeleteMember(e, member)
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                </Box>
              </Box>
            );
          })}
      </Box>

      {userInfo?.role === enumRoles?.PROJECT_MANAGER && (
        <Button
          sx={{ position: "absolute", bottom: "10px", left: '50%', transform: 'translateX(-50%)' }}
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={() => handleClickOpenModalAddMembers()}
        >
          Add member
        </Button>
      )}

      {/* Popup confirm when delete member */}
      <PopUpConfirm 
        open={openPopupConfirm}
        onCancel={handleClosePopupDeleteMember}
        onConfirm={() => handleRemoveMemberFromChannel()}
        content="Are you sure to delete this member!"
      />

      {/* Add Members Modal */}
      <ModalAddUser 
        open={openAddUserModal}
        onClose={setOpenAddUserModal}
      />
    </Box>
  );
};
