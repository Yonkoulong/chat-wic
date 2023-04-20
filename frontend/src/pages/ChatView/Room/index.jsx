import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Threads, Members, RoomInfo, UserInfo, Messages, Files, Tasks } from "@/pages/ChatView/FeaturesRoom";

import { Box } from "@/shared/components";
import { RoomChatContainer } from "./Room.styles";

import { RoomHeader, RoomContent, BoxMessage } from "./components";
import { getChannelDetail } from "@/services/channel.services";
import { getDirectDetail } from "@/services/direct.services";
import { useRoomStore } from "@/stores/RoomStore";
import { enumTypeRooms, enumPopupFeatures } from "@/shared/utils/constant";
import { primaryColor, borderColor } from "@/shared/utils/colors.utils";
import { useSocketStore } from "../../../stores/SocketStore";

export const RoomChat = () => {
  const { id } = useParams();
  const location = useLocation();

  const client = useSocketStore((state) => state.client);
  const setRoomInfo = useRoomStore((state) => state.setRoomInfo);
  const setTypeRoom = useRoomStore((state) => state.setTypeRoom);
  const typeRoom = useRoomStore((state) => state.typeRoom);
  const typeFeatureRoom = useRoomStore((state) => state.typeFeatureRoom);
  const setTypeFeatureRoom = useRoomStore((state) => state.setTypeFeatureRoom);

  const handleShowPopupFeatures = () => {
    switch (typeFeatureRoom) {
      case enumPopupFeatures.THREAD:
        return <Threads key={enumPopupFeatures.THREAD}/>;
      case enumPopupFeatures.MEMBERS:
        return <Members key={enumPopupFeatures.MEMBERS}/>;
      case enumPopupFeatures.ROOM_INFO:
        return <RoomInfo key={enumPopupFeatures.ROOM_INFO}/>;
      case enumPopupFeatures.USER_INFO:
        return <UserInfo key={enumPopupFeatures.USER_INFO}/>;
      case enumPopupFeatures.MESSAGES:
        return <Messages key={enumPopupFeatures.MESSAGES}/>;
      case enumPopupFeatures.FILES:
        return <Files key={enumPopupFeatures.FILES}/>;
      case enumPopupFeatures.TODO_LIST:
        return <Tasks key={enumPopupFeatures.TODO_LIST}/>;
    }
  };

  const handleFindLocationMatchPopupFeature = () => {
    for (const key in enumPopupFeatures) {
      if (location?.pathname?.match(enumPopupFeatures[key])) {
        const feature = location?.pathname?.match(enumPopupFeatures[key]);
        setTypeFeatureRoom(feature[0]);
        return;
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let resp;
        if (location?.pathname?.indexOf(enumTypeRooms.CHANNEL) !== -1) {
          resp = await getChannelDetail({ channelId: id });
          setTypeRoom(enumTypeRooms.CHANNEL);
        }

        if (location?.pathname?.indexOf(enumTypeRooms.DIRECT) !== -1) {
          resp = await getDirectDetail({ directId: id });
          setTypeRoom(enumTypeRooms.DIRECT);
        }

        if (resp) {
          setRoomInfo(resp?.data?.content);
          handleFindLocationMatchPopupFeature();
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        toast.error(errorMessage);
      }
    })();
  }, [location]);

  useEffect(() => {
    if(!id || !client) { return; }

    client.emit('room', id);
  }, [id, client])

  return (
    <RoomChatContainer>
      <RoomHeader />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          width={typeFeatureRoom ? "65%" : "100%"}
          sx={{ position: "relative" }}
        >
          <RoomContent />
          <BoxMessage />
        </Box>
        {typeFeatureRoom ? (
          <Box width="35%" sx={{ borderLeft: `1px solid ${borderColor}` }}>
            {handleShowPopupFeatures()}
          </Box>
        ) : null}
      </Box>
    </RoomChatContainer>
  );
};
