import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Box } from "@/shared/components";
import { RoomChatContainer } from "./Room.styles";

import { RoomHeader, RoomContent, BoxMessage } from "./components";
import { getChannelDetail } from "@/services/channel.services";
import { useRoomStore } from "@/stores/RoomStore";
import { enumTypeRooms } from "@/shared/utils/constant";

export const RoomChat = () => {
  const { id } = useParams();
  const location = useLocation();

  const setRoomInfo = useRoomStore((state) => state.setRoomInfo);
  const setTypeRoom = useRoomStore((state) => state.setTypeRoom);
  const enumPopupFeatures = useRoomStore((state) => state.enumPopupFeatures);

  const handlePopupFeatures = () => {};

  useEffect(() => {
    (async () => {
      try {
        let resp;

        if (location?.pathname?.indexOf(enumTypeRooms.CHANNEL) !== -1) {
          resp = await getChannelDetail({ channelId: id });
          setTypeRoom(enumTypeRooms.CHANNEL);
        }

        if (location?.pathname?.indexOf(enumTypeRooms.DIRECT) !== -1) {
          resp = await getChannelDetail({ directId: id });
          setTypeRoom(enumTypeRooms.DIRECT);
        }

        if (resp) {
          setRoomInfo(resp?.data?.content);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, [location]);

  return (
    <RoomChatContainer>
      <RoomHeader />
      <Box sx={{ display: 'flex' }}>
        <Box width={enumPopupFeatures ? "60%" : "100%"} sx={{ position: 'relative' }}>
          <RoomContent />
          <BoxMessage />
        </Box>
        <Box width={enumPopupFeatures ? "40%" : "0"}>{handlePopupFeatures}</Box>
      </Box>
    </RoomChatContainer>
  );
};
