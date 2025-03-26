"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { GetNotificationsParams, NotificationsResponse } from "./interface";

async function getAuthToken() {
  const cookie = await cookies();
  return cookie.get("token")?.value || null;
}

export async function fetchNotifications(
  params: GetNotificationsParams = {},
): Promise<NotificationsResponse> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, notifications: null, error: "Token not found" };
  }

  return axios
    .get(`${baseURL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    .then((res) => {
      return {
        success: true,
        notifications: res.data.notifications,
        pagination: res.data.pagination,
        error: null,
      };
    })
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

export async function markAsUnread(notificationId: string) {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return axios
    .put(
      `${baseURL}/notifications/${notificationId}/unread`,
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

export async function deleteNotification(notificationId: string) {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return axios
    .delete(`${baseURL}/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
