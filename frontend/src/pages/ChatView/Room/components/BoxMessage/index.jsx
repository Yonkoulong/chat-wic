import React, { useState } from "react";
import { Box, TextareaAutosize } from "@/shared/components";
import {
  SymbolsAttachFileIcon,
  SymbolsImageOutlineIcon,
  StickerEmojiIcon,
  FluentTaskAddIcon,
} from "@/assets/icons";

import { BoxMessageContainer } from "./BoxMessage.styles";
import { borderColor } from "@/shared/utils/colors.utils";

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

export const BoxMessage = () => {

    const handleChat = (e) => {
        console.log(e.target.value)
    }

  return (
    <BoxMessageContainer>
      <Box
        sx={{
          ...flexCenter,
          padding: "16px 24px",
          borderWidth: "2px",
          borderStyle: "solid none",
          borderColor: `${borderColor}`,
        }}
      >
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px 0 0",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <StickerEmojiIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <SymbolsImageOutlineIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 10px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <SymbolsAttachFileIcon />
        </Box>
        <Box
          sx={{
            ...flexCenter,
            margin: "0 16px",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <FluentTaskAddIcon />
        </Box>
      </Box>
      <Box>
        <Box>
          <TextareaAutosize
            placeholder="Message"
            style={{
              width: "100%",
              maxHeight: "250px",
              padding: "16px 24px",
              display: "block",
              border: "none",
              outline: "none",
              fontSize: "18px",
              resize: 'none'
            }}
            onChange={handleChat}
          />
        </Box>
      </Box>
    </BoxMessageContainer>
  );
};
