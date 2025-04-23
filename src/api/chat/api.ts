"use server";

import axios from "axios";
import { baseURL } from "..";
import { cookies } from "next/headers";

export async function getChatList(take: number = 25, skip: number = 0) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, chats: null, error: "Token not found" };
  }

  return await axios
    .get(`${baseURL}/chat?take=${take}&skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { success: true, chats: res.data.data, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        chats: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}

export async function createChat(buddyId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, chatId: null, error: "Token not found" };
  }

  return await axios
    .post(`${baseURL}/chat/${buddyId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: res.data.success,
        chatId: res.data.data.chatId,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        chatId: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}

export async function getChatMessages(
  chatId: string,
  take: number = 50,
  skip: number = 0,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, messages: null, error: "Token not found" };
  }

  return await axios
    .get(`${baseURL}/chat/${chatId}/messages?take=${take}&skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { success: true, messages: res.data.data, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        messages: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}
