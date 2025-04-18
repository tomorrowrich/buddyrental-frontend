"use server";

import { cookies } from "next/headers";
import { baseURL } from "@/api";

import axios from "axios";
import {
  CategoriesProps,
  CategoriesResponse,
  ReportData,
  ReportPayload,
  ReportResponse,
} from "./interface";

export async function submitReport(
  data: ReportPayload,
): Promise<ReportResponse> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }
  console.log("submit data: ", data);
  try {
    const response = await axios.post(`${baseURL}/reports`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCategories(
  data: CategoriesProps,
): Promise<CategoriesResponse[]> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }
  console.log(data);
  try {
    const response = await axios.get(`${baseURL}/reports/categories`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error get categories: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function getReports(
  status?: "PENDING" | "RESOLVED",
  take?: number,
  skip?: number,
): Promise<ReportData[]> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }
  try {
    const response = await axios.get(`${baseURL}/reports`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: status ? { status } : {}, // ส่ง status เป็น query params ถ้ามี
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error get Reports: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function resolveReport(
  reportId: string,
  status: "PENDING" | "RESOLVED",
  action?: "ban" | "10days" | "1month" | "3months",
): Promise<ReportResponse> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.patch(
      `${baseURL}/reports/${reportId}`,
      null, // ไม่ต้องมี body ใน request, ข้อมูลจะถูกส่งผ่าน query params
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          status,
          action,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error resolving report: ${error.response?.status}`);
    }
    throw error;
  }
}

export const setSuspendTime = async (
  userId: string | undefined,
  suspendTime: number,
) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    console.log("suspendTime: ", suspendTime);

    // ตรวจสอบให้แน่ใจว่า suspendTime ถูกส่งใน request body
    const response = await fetch(`${baseURL}/users/${userId}/suspend`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // ต้องมีการระบุ content type
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ suspendTime }), // ส่งค่าของ suspendTime เป็น JSON
    });

    if (!response.ok) {
      throw new Error("Failed to suspend user");
    }
    return response.json();
  } catch (error) {
    console.error("Error occurred during suspension:", error);
    throw error;
  }
};

// ฟังก์ชันในการ ban user
export const setBan = async (userId: string | undefined, isBanned: boolean) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;
  try {
    console.log("isBanned: ", isBanned);
    const response = await fetch(`${baseURL}/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ isBanned }),
    });
    if (!response.ok) {
      throw new Error("Failed to ban user");
    }
    return response.json();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error ban user: ${error.response?.status}`);
    }
    throw error;
  }
};

export const getSuspendUser = async (report: ReportData) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;
  try {
    const response = await axios.get(`${baseURL}/users/${report.buddyId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suspended users:", error);
    throw error;
  }
};
