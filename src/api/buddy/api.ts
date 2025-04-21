"use server";

import { cookies } from "next/headers";
import { baseURL } from "@/api";
import { Buddy, BuddyWithUser } from "@/model/buddy";
import {
  CreateBuddyRequest,
  GetBuddyParams,
  ListBuddiesParams,
} from "./interface";
import axios from "axios";

export async function getBuddy({
  buddyId,
}: GetBuddyParams): Promise<BuddyWithUser> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await axios.get(`${baseURL}/buddy/profile/${buddyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    return response.data as BuddyWithUser;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching buddy: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function listBuddies(
  params: ListBuddiesParams = {},
): Promise<Buddy[]> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  // Build query parameters
  const queryParams: Record<string, string | string[]> = {};

  if (params.page) queryParams["page"] = params.page.toString();
  if (params.limit) queryParams["limit"] = params.limit.toString();

  if (params.filter) {
    if (params.filter.priceMin)
      queryParams["filter.priceMin"] = params.filter.priceMin.toString();
    if (params.filter.priceMax)
      queryParams["filter.priceMax"] = params.filter.priceMax.toString();
    if (params.filter.ratingMin)
      queryParams["filter.ratingMin"] = params.filter.ratingMin.toString();
    if (params.filter.tags) {
      queryParams["filter.tags"] = params.filter.tags;
    }
  }

  if (params.sort) {
    queryParams["sort.field"] = params.sort.field;
    queryParams["sort.direction"] = params.sort.direction;
  }

  try {
    const response = await axios.get(`${baseURL}/buddies`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
      params: queryParams,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error listing buddies: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function createBuddy(data: CreateBuddyRequest): Promise<Buddy> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }
  console.log("Creating buddy with data:", data);

  try {
    const response = await axios.post(`${baseURL}/buddy`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error creating buddy: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function updateBuddy({ buddyId, ...data }: Buddy): Promise<Buddy> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.patch(`${baseURL}/buddy/${buddyId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error updating buddy: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function deleteBuddy(buddyId: string): Promise<void> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  try {
    await axios.delete(`${baseURL}/buddy/${buddyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error deleting buddy: ${error.response?.status}`);
    }
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("token")?.value;
}

export async function getCurrentUserBuddy(): Promise<Buddy | null> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("token")?.value;

    const response = await axios.get(`${baseURL}/buddy/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // User doesn't have a buddy profile yet
      return null;
    }
    console.error("Error getting current user buddy:", error);
    return null;
  }
}
