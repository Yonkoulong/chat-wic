import React, { useState } from "react";

import { Box, Typography, Button, Paper } from "@/shared/components";

import {
  ModalCreateDirect,
  ModalCreateChannel,
} from "@/pages/ChatView/Components/Modal";

export const ChatHome = () => {
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [openCreateDirectMessageModal, setOpenCreateDirectMessageModal] =
    useState(false);

  const handleClickOpenModalCreateChannel = () => {
    setOpenCreateChannelModal(true);
    setAnchorRoom(null);
  };

  const handleClickOpenModalCreateDirect = () => {
    setOpenCreateDirectMessageModal(true);
    setAnchorRoom(null);
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
        <Box sx={{ display: "flex", gap: "30px" }}>
          <Paper
            sx={{
              flex: "0 0 33.33333%",
              maxWidth: "33.33333%",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'space-between',
              height: '180px'
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
            >
              Create Channel
            </Button>
          </Paper>
          <Paper
            sx={{
              flex: "0 0 33.33333%",
              maxWidth: "33.33333%",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'space-between'
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
              mt={2}
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
