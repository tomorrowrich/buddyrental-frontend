import { io, Socket } from "socket.io-client";
import { ChatMessage, ChatMessageDTO } from "./interface";

let socket: Socket;

export const initializeSocket = (userId: string, token: string): Socket => {
  if (!socket) {
    // Use a secure WebSocket connection to your backend
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
      path: "/api/ws",
      withCredentials: true,
      auth: {
        userid: userId,
        token,
      },
      extraHeaders: {
        userid: userId,
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      autoConnect: true,
    });
  }
  return socket;
};

export const subscribeToMessages = (
  callback: (message: ChatMessage) => void,
) => {
  if (!socket) return;

  socket.on(`message`, (message: ChatMessage) => {
    callback(message);
    console.log(message);
  });

  return () => {
    socket.off(`message`);
  };
};

export const sendMessage = (message: ChatMessageDTO): void => {
  if (!socket || !socket.connected) {
    console.error("Socket not connected");
    return;
  }
  socket.emit("message", message);
};

export { socket };
