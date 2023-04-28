import React from "react";
import { Typography } from "@mui/material";

export const TruncateString = ({ width, line, children, color }) => {
  return (
    <Typography
      sx={{
        display: "-webkit-box",
        "-webkitLineClamp": line,
        "-webkitBoxOrient": "vertical",
        width,
        color: color || "black",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </Typography>
  );
};
