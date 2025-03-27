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
  console.log(data);
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

export async function getReports(): Promise<ReportData[]> {
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
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error get Reports: ${error.response?.status}`);
    }
    throw error;
  }
}
