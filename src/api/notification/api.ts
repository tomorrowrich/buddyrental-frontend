"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { GetNotificationsParams, NotificationsResponse } from "./interface";
import { redirect } from "next/navigation";

async function getAuthToken() {
  const cookie = await cookies();
  return cookie.get("token")?.value || null;
}

export async function fetchNotifications(
  params: GetNotificationsParams = {},
): Promise<NotificationsResponse> {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  return axios
    .get(`${baseURL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        notifications: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function fetchUnreadNotifications(
  params: GetNotificationsParams = {},
): Promise<NotificationsResponse> {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  return axios
    .get(`${baseURL}/notifications/unread`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        notifications: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function markAsRead(notificationId: string) {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return axios
    .put(
      `${baseURL}/notifications/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => {
      return { success: true, message: res.data.message, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function markAllAsRead() {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return axios
    .post(
      `${baseURL}/notifications/read-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => {
      return { success: true, message: res.data.message, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function subscribeToNotifications() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const eventSource = new EventSource(
    `${baseURL}/notifications/stream?token=${token}`,
  );
  return eventSource;
}
