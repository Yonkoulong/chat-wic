import { useEffect, useState } from "react";
import SockJs from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";

const SocketConnection =
  import.meta.env.VITE_APP_ROOT_SOCKET_CONNECTION || "http://localhost:4000";

export const keycloakId = new Date().getTime();

export const useSocket = ({ initAction }) => {
  const [client, setClient] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = () => {
    const newSocket = new SockJs(SocketConnection, {
      transports: ["websocket"],
      rejectUnauthorized: false,
    });
    const stompClient = Stomp.over(newSocket);
    setClient(stompClient);

    const headers = {
      keycloakId,
    };

    stompClient.connect(headers, () => {
      initAction(stompClient);
      setIsConnected(true);
    });

    stompClient.onWebSocketClose = () => {
      setClient(undefined);
      setIsConnected(false);
    };

    return stompClient;
  };

  useEffect(() => {
    connectSocket();

    return () => {
      setIsConnected(false);
      client?.disconnect && client.disconnect();
    };
  }, []);

  return { client, isConnected };
};

export default useSocket;
