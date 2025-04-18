// src/api/buddies/api.client.ts
import axios from "axios";
import { baseURL } from ".."; // ตั้งค่าตามที่คุณต้องการ

/**
 * Fetch all buddies for the client.
 *
 * @returns {Promise<{success: boolean, data: Buddy[] | null, error: string | null}>}
 */
export async function fetchBuddiesClient() {
  try {
    const res = await axios.get(`${baseURL}/buddies`);
    return {
      success: true,
      data: res.data.buddies,
      error: null,
    };
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "response" in err) {
      const error = err as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Unknown error",
      };
    }
    return {
      success: false,
      data: null,
      error: "Unknown error",
    };
  }
}
