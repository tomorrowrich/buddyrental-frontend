"use server";

import { baseURL } from "@/api";
import { User } from "@/model/user";
import axios from "axios";
import { cookies } from "next/headers";

/**
 * Fetches the list of unverified users from the server.
 *
 * @returns {Promise<{ success: boolean; users: User[]; error: null } | { success: boolean; users: null; error: string }>}
 * A promise that resolves to an object containing:
 * - `success`: A boolean indicating whether the request was successful.
 * - `users`: An array of `User` objects if the request was successful, otherwise `null`.
 * - `error`: A string containing the error message if the request failed, otherwise `null`.
 */
export async function getUnverifiedUsers(
  page: number = 1,
  perpage: number = 10,
) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, users: null, error: "Token not found" };
  }

  return axios
    .get<{ data: User[] }>(
      `${baseURL}/admin/verify?page=${page}&perPage=${perpage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return { success: true, users: res.data, error: null };
    })
    .catch((error) => {
      return {
        success: false,
        users: null,
        error: error.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Verifies a user based on the provided parameters.
 *
 * @param {boolean} accept - A boolean indicating whether to accept or reject the user verification.
 * @param {string} userId - The ID of the user to be verified.
 * @param {string} reason - The meassage for rejecting the user verification (optional).
 * @returns {Promise<{ success: boolean; error: string | null }>}
 * A promise that resolves to an object containing:
 * - `success`: A boolean indicating whether the request was successful.
 * - `error`: A string containing the error message if the request failed, otherwise `null`.
 */
export async function verifyUser(
  accept: boolean,
  userId: string,
  messaage: string = "",
) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return axios
    .post(
      `${baseURL}/admin/verify`,
      { accept, userId, reason: messaage },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((_) => {
      return { success: true, error: null };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.response?.data?.message || "Unknown error",
      };
    });
}
