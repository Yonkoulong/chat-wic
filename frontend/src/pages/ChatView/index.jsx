import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ChatViewContainer } from "./ChatView.styles";

import io from "socket.io-client";
import { useSocketStore } from "@/stores/SocketStore";
import {useAppStore  } from "@/stores/AppStore";

export const ChatView = () => {
  const { setClient, client } = useSocketStore((state) => state);
  const { userInfo } = useAppStore((state) => state);

  useEffect(() => {
    const client = io("http://localhost:8080",{extraHeaders:{userId: userInfo?._id }});
    client.on("connect", () => {
      setClient(client);
    });

    client.on("disconnect", () => {
      setClient(null);
    });

    return () => {
      client.disconnect();
    };
  }, []);
  

  return (
    <ChatViewContainer>
      <Sidebar />
      <Outlet />
    </ChatViewContainer>
  );
};
