import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ChatViewContainer } from './ChatView.styles';

import io from 'socket.io-client';
import { useSocketStore } from '@/stores/SocketStore';
import { useAppStore } from '@/stores/AppStore';
import { getChannelsByUser } from '@/services/channel.services';
import { getDirectsByUserId } from '@/services/direct.services';
import { useRoomStore } from '@/stores/RoomStore';

export const ChatView = () => {
  const { setClient, client } = useSocketStore((state) => state);
  const { userInfo } = useAppStore((state) => state);
  const { setChannelRooms, setDirectRooms } = useRoomStore((state) => state);

  useEffect(() => {
    const client = io(
      import.meta.env.VITE_CHAT_WIC_API_ENV == 'dev'
        ? import.meta.env.VITE_CHAT_WIC_API || 'http://localhost:8080'
        : 'https://be-chat-wic.onrender.com',
      {
        extraHeaders: { userId: userInfo?._id },
      }
    );
    client.on('connect', () => {
      setClient(client);

      //channel
      client.on('invited-to-a-channel', async () => {
        const respChannels = await getChannelsByUser(userInfo);
        if (Array.isArray(respChannels?.data?.content)) {
          setChannelRooms(respChannels?.data?.content);
        }
      });

      //direct
      client.on('invited-to-a-direct', async () => {
        const respDirects = await getDirectsByUserId(userInfo);
        if (Array.isArray(respDirects?.data?.content)) {
          setDirectRooms(respDirects?.data?.content);
        }
      });
    });

    client.on('disconnect', () => {
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
