import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Threads,
  Members,
  RoomInfo,
  UserInfo,
  Messages,
  Files,
  Tasks,
  TaskDetail,
} from "@/pages/ChatView/FeaturesRoom";

import { Box } from "@/shared/components";
import { RoomChatContainer } from "./Room.styles";

import { RoomHeader, RoomContent, BoxMessage } from "./components";
import { getChannelDetail } from "@/services/channel.services";
import { getDirectDetail } from "@/services/direct.services";
import { useRoomStore } from "@/stores/RoomStore";
import { enumTypeRooms, enumPopupFeatures } from "@/shared/utils/constant";
import { primaryColor, borderColor } from "@/shared/utils/colors.utils";
import { useAppStore } from "@/stores/AppStore";
import { useSocketStore } from "@/stores/SocketStore";

export const RoomChat = () => {
  const { id } = useParams();
  const location = useLocation();

  const client = useSocketStore((state) => state.client);
  const { userInfo } = useAppStore((state) => state);
  const { setRoomInfo, setTypeRoom, typeFeatureRoom, setTypeFeatureRoom } =
    useRoomStore((state) => state);

  const handleShowPopupFeatures = () => {
    switch (typeFeatureRoom) {
      case enumPopupFeatures.THREAD:
        return <Threads />;
      case enumPopupFeatures.MEMBERS:
        return <Members />;
      case enumPopupFeatures.ROOM_INFO:
        return <RoomInfo />;
      case enumPopupFeatures.USER_INFO:
        return <UserInfo />;
      case enumPopupFeatures.MESSAGES:
        return <Messages />;
      case enumPopupFeatures.FILES:
        return <Files />;
      case enumPopupFeatures.TODO_LIST:
        return <Tasks />;
      case enumPopupFeatures.TODO_DETAIL:
        return <TaskDetail />;
    }
  };

  const handleFindLocationMatchPopupFeature = () => {
    for (const key in enumPopupFeatures) {
      if (location?.pathname?.match(enumPopupFeatures[key])) {
        const feature = location?.pathname?.match(enumPopupFeatures[key]);
        setTypeFeatureRoom(feature[0]);
        return;
      }
      
      // if(location?.pathname?.indexOf(enumPopupFeatures[key]) !== -1) {
      //   setTypeFeatureRoom(enumPopupFeatures[key]);
      //   return;
      // }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let resp;

        if (location?.pathname?.indexOf(enumTypeRooms.CHANNEL) !== -1) {
          resp = await getChannelDetail(id, {
            organizeId: userInfo?.organizeId,
            userId: userInfo?._id,
          });
          setTypeRoom(enumTypeRooms.CHANNEL);
        }

        if (location?.pathname?.indexOf(enumTypeRooms.DIRECT) !== -1) {
          resp = await getDirectDetail(id, {
            organizeId: userInfo?.organizeId,
            userId: userInfo?._id,
          });
          setTypeRoom(enumTypeRooms.DIRECT);
        }
        if (resp) {
          setRoomInfo(resp?.data?.content);
          handleFindLocationMatchPopupFeature();
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.content;
        throw error;
      }
    })();

  }, []);

  useEffect(() => {
    if (!id || !client) {
      return;
    }

    client.emit("room", id);
  }, [id, client]);

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
