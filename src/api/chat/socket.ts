"use client";

import { io } from "socket.io-client";
import { socketURL } from "..";
import Cookies from "js-cookie";
import { getProfile } from "../auth/api";


export const socket = io(socketURL, {
  auth: {
    userId: getProfile().user?.userId,
    token: Cookies.get("token"),
  },
  path: "/api/ws",
})