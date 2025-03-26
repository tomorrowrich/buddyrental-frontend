"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { Interest } from "@/model/user";

/**
 * Fetches all interests from the server.
 *
 * @returns {Promise<{ success: boolean, interests: Interest[] | null, error: string | null }>}
 * An object containing the success status, the list of interests, and an error message if any.
 */
export async function getAllInterests() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, intersts: null, error: "Token not found" };
  }

  return await axios
    .get<Interest[]>(`${baseURL}/interests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { success: true, interests: res.data, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        interests: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}

/**
 * Adds a new interest to the server.
 *
 * @param {string} interest - The name of the interest to add.
 * @returns {Promise<{ success: boolean, interest: Interest | null, error: string | null }>}
 * An object containing the success status, the added interest, and an error message if any.
 */
export async function addInterest(interest: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, error: "Token not found" };
  }

  return await axios
    .post<Interest>(
      `${baseURL}/interests`,
      { name: interest },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return { success: true, interest: res.data, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        interest: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}

/**
 * Fetches interest suggestions from the server.
 *
 * @returns {Promise<{ success: boolean, interests: Interest[] | null, error: string | null }>}
 * An object containing the success status, the list of interest suggestions, and an error message if any.
 */
export async function getInterestSuggestions() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, interests: null, error: "Token not found" };
  }

  return await axios
    .get(`${baseURL}/interests/suggestions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        take: 5,
      },
    })
    .then((res) => {
      const interests = res.data.suggestions.map(
        ({ id, name }: { id: number; name: string }) => ({ tagId: id, name }),
      );
      return { success: true, interests: interests, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        interests: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}

/**
 * Searches for interests based on a query string.
 *
 * @param {string} query - The search query string.
 * @returns {Promise<{ success: boolean, interests: Interest[] | null, error: string | null }>}
 * An object containing the success status, the list of matching interests, and an error message if any.
 */
export async function searchInterest(query: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, interests: null, error: "Token not found" };
  }

  return await axios
    .get<{ tags: Interest[] }>(`${baseURL}/interests/search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { success: true, interests: res.data.tags, error: null };
    })
    .catch((err) => {
      return {
        success: false,
        interests: null,
        error: err.response.data.message || "Unknown error",
      };
    });
}
