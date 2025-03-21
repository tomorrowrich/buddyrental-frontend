"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { MakeBuddyData } from "./interface";

export async function makeBuddy(data: MakeBuddyData) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return { success: false, intersts: null, error: "Token not found" };
  }

  return axios
    .post(`${baseURL}/buddy/make-buddy`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { success: true, data: res.data, error: null };
    })
    .catch((err) => {
      return { success: false, error: err, data: null };
    });
}
