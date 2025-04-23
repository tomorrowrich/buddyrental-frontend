"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baseURL } from "..";

/**
 * Fetch all buddies.
 *
 * @returns {Promise<{success: boolean, data: Buddy[] | null, error: string | null}>}
 */
export async function fetchBuddies() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await axios
    .get(`${baseURL}/buddies?limit=30`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => ({
      success: true,
      data: res.data.buddies,
      error: null,
    }))
    .catch((err) => ({
      success: false,
      data: null,
      error: err.response?.data?.message || "Unknown error",
    }));
}
