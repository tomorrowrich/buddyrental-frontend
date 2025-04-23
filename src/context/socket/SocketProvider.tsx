import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket, socket } from "@/api/chat/socket";
import { useAuth } from "@/context/auth/auth";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user, isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user && token) {
      // Initialize socket connection
      const socketInstance = initializeSocket(user.userId, token);

      const onConnect = () => {
        console.log("Socket connected!");
        setIsConnected(true);
      };

      const onDisconnect = () => {
        console.log("Socket disconnected!");
        setIsConnected(false);
      };

      socketInstance.on("connect", onConnect);
      socketInstance.on("disconnect", onDisconnect);

      // Check initial connection state
      if (socketInstance.connected) {
        setIsConnected(true);
      }

      return () => {
        socketInstance.off("connect", onConnect);
        socketInstance.off("disconnect", onDisconnect);
      };
    }
  }, [isAuthenticated, token, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
