import { baseURL } from "@/api";

/**
 * Fetch all buddies (client-side) by receiving token from caller.
 *
 * @param token - JWT token from client storage
 * @returns Promise<{ success: boolean, data: Buddy[] | null, error: string | null }>
 */
export async function fetchBuddiesClient() {
  const res = await fetch(`${baseURL}/buddies`);
  if (!res.ok) {
    throw new Error("Failed to fetch buddies");
  }
  return res.json();
}
