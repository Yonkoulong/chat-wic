import React, { useState } from "react";

import { Box, Typography, Button, Paper } from "@/shared/components";
import { useAppStore } from "@/stores/AppStore";

import {
  ModalCreateDirect,
  ModalCreateChannel,
} from "@/pages/ChatView/Components/Modal";
import { enumRoles } from "@/shared/utils/constant";

export const ChatHome = () => {
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [openCreateDirectMessageModal, setOpenCreateDirectMessageModal] =
    useState(false);

  const { userInfo } = useAppStore((state) => state);

  const handleClickOpenModalCreateChannel = () => {
    setOpenCreateChannelModal(true);
  };

  const handleClickOpenModalCreateDirect = () => {
    setOpenCreateDirectMessageModal(true);
  };

  return (
    <Box sx={{ padding: "16px 24px", width: "100%" }}>
      <Box>
        <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
          Home
        </Typography>
        <Box
          sx={{
            marginTop: "32px",
          }}
        >
          <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
            Welcome to WIC.chat
          </Typography>
          <Typography
            sx={{ fontSize: "16px", marginTop: "4px", fontWeight: "bold" }}
          >
            Some ideas to get you started
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: "50px" }}>
        <Box sx={{ display: "flex", gap: "30px", flexDirection: {xs: 'column', sm: "row"} }}>
          {userInfo && userInfo?.role == enumRoles.PROJECT_MANAGER && (
            <Paper
              sx={{
                flex: {xs: "0 0 100%", sm:"0 0 calc(50% - 15px)", md: "0 0 33.33333%"},
                maxWidth: {xs: "100%", sm: "50%", md: "33.33333%"},
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "180px",

              }}
            >
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  Create channels
                </Typography>
                <Typography fontSize="small" mt={2}>
                  Create public channel that new workspace members can join.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => handleClickOpenModalCreateChannel()}
                sx={{ marginTop: {xs: "24px", sm: "0"}}}
              >
                Create Channel
              </Button>
            </Paper>
          )}
          <Paper
            sx={{
              flex: {xs: "0 0 100%", sm:"0 0 calc(50% - 15px)", md: "0 0 calc(33.33333% - 10px)"},
              maxWidth: {xs: "100%", sm: "50%", md: "33.33333%"},
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "180px",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                Create direct message
              </Typography>
              <Typography fontSize="small" mt={2}>
                Create private message between two partners.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => handleClickOpenModalCreateDirect()}
              sx={{ marginTop: {xs: "24px", sm: "0"}}}
            >
              Create direct message
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* modal create channel */}
      <ModalCreateChannel
        open={openCreateChannelModal}
        onClose={setOpenCreateChannelModal}
      />

      {/* modal create direct */}
      <ModalCreateDirect
        open={openCreateDirectMessageModal}
        onClose={setOpenCreateDirectMessageModal}
      />
    </Box>
  );
};
