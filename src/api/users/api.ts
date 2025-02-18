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
