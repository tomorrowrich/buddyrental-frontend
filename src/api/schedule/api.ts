"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { ScheduleQueryParams } from "./interface";
import { redirect } from "next/navigation";

async function getAuthToken() {
  const cookie = await cookies();
  return cookie.get("token")?.value || null;
}

export async function getSchedule(params?: ScheduleQueryParams) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  if (!params) {
    const currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the month
    params = {
      startDate: currentDate,
      endDate: new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
    } as ScheduleQueryParams;
  }

  return axios
    .get(`${baseURL}/schedule`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        services: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function getBuddySchedule(
  buddyId: string,
  params?: { start?: Date; end?: Date },
) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const startDate = params?.start ? new Date(params.start) : new Date();
  const endDate = params?.end
    ? new Date(params.end)
    : new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  if (startDate > endDate) {
    throw new Error("Start date must be before end date");
  }

  return axios
    .get(
      `${baseURL}/schedule/buddy/${buddyId}?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        services: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function getPersonalSchedule(params?: {
  start?: Date;
  end?: Date;
}) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const startDate = params?.start ? new Date(params.start) : new Date();
  const endDate = params?.end
    ? new Date(params.end)
    : new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  if (startDate > endDate) {
    throw new Error("Start date must be before end date");
  }

  return axios
    .get(
      `${baseURL}/schedule/personal?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        services: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}
