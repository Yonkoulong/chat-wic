import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ChatViewContainer } from "./ChatView.styles";

import io from "socket.io-client";
import { useSocketStore } from "@/stores/SocketStore";
import { useAppStore } from "@/stores/AppStore";
import { getChannelsByUser } from "@/services/channel.services";
import { useRoomStore } from "@/stores/RoomStore";

export const ChatView = () => {
  const { setClient, client } = useSocketStore((state) => state);
  const { userInfo } = useAppStore((state) => state);
  const { setChannelRooms } = useRoomStore((state) => state);

  useEffect(() => {
    const client = io("http://localhost:8080", {
      extraHeaders: { userId: userInfo?._id },
    });
    client.on("connect", () => {
      setClient(client);
      client.on("invited-to-a-channel", async () => {
        const respChannels = await getChannelsByUser(userInfo);
        if (Array.isArray(respChannels?.data?.content)) {
          setChannelRooms(respChannels?.data?.content);
        }
      });
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
