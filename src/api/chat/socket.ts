"use client";

import { io, Socket } from "socket.io-client";
import { socketURL } from "..";
import Cookies from "js-cookie";

export let socket: Socket;

export async function initializeSocket(userId: string) {
  const token = Cookies.get("token");

  socket = io(socketURL, {
    withCredentials: true,
    auth: {
      token,
      userId,
    },
    path: "/api/ws",
    // extraHeaders: {
    //   "userId": userId,
    //   "token": token,
    // }
  });
}

export async function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}
