"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baseURL } from "@/api";
import { AxiosError } from "axios";

export async function fetchBuddies() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.get(`${baseURL}/buddies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: res.data.buddies,
      error: null,
    };
  } catch (error) {
    // Type guard to check if it's an AxiosError
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      error: err.response?.data?.message || "Unknown error",
    };
  }
}
