import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import { ChatViewContainer } from "./ChatView.styles";
import { putUpdateUserStatus } from "@/services/member.service";
import { enumMemberStatus } from "@/shared/utils/constant";
import { useSocketStore } from "@/stores/SocketStore";

export const ChatView = () => {
  
  const client = useSocketStore((state) => state.client);
    console.log(client);
    console.log(client);
//   useEffect(() => {
//     (async () => {
//       if (client) {
//         const resp = await putUpdateUserStatus(respData?.data?._id, {
//           userStatus: enumMemberStatus.ONLINE,
//         });

//         if (resp?.data) {
//           client.emit("update-status-user", resp?.data);
//         }
//       }
//     })();
//   }, [client]);

  return (
    <ChatViewContainer>
      <Sidebar />
      <Outlet />
    </ChatViewContainer>
  );
};
