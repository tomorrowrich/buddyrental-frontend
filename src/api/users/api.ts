"use server";

import { User } from "@/model/user";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baseURL } from "..";

export async function updateProfile(user: Partial<User>) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  return await axios
    .patch(`${baseURL}/users/profile`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("Profile updated successfully:", res.data);
      return { success: true, error: null };
    })
    .catch((err) => {
      if (err.response) {
        return {
          success: false,
          error: err.response.data.message,
        };
      }
      console.log(err);
      return { success: false, error: "Unknown error" };
    });
}

/**
 * Update user's interests.
 *
 * @param {string[]} interests - Array of interests
 * @returns {Promise<{success: boolean, error: string | null}>} - Returns success and error message
 *  - success: true if the interests are updated successfully, false otherwise
 *  - error: error message if the interests are not updated successfully
 */
export async function updateInterests(interests: string[]) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, error: "Toekn not found" };
  }

  return await axios
    .put(
      `${baseURL}/users/interests`,
      { interests: interests },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((_) => {
      return { success: true, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        error: err.response.data.message || "Unknown error",
      };
    });
}

export async function getUser(userId: string): Promise<User> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.get(`${baseURL}/users/${userId}`, {
      headers: {
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
