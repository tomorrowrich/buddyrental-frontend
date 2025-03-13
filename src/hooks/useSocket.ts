import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/auth/auth";

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setError("User is not authenticated");
      return;
    }

    const ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
    // We're using cookies for authentication, so we don't need to pass token explicitly
    const socketInstance = io(`${ENDPOINT}/chats`, {
      path: "/api/ws",
      auth: {
        userid: user.userId,
        // The cookie will be sent automatically with the request
      },
      transports: ["websocket"],
      withCredentials: true, // Important for sending cookies
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
      setConnected(true);
      setError(null);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat server");
      setConnected(false);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("connected", (data) => {
      console.log("Connected message received:", data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, user?.userId]);

  return { socket, connected, error };
};
