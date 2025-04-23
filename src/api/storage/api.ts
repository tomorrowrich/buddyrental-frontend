"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baseURL } from "..";

export async function uploadProfile(formData: FormData) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  return await axios
    .post(`${baseURL}/storage/profiles`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("Upload Complete! Url");
      return { success: true, error: null, url: res.data };
    })
    .catch((err) => {
      if (err.response) {
        return {
          success: false,
          url: null,
          error: err.response.data.message,
        };
      }
      console.log(err);
      return { success: false, error: "Unknown error", url: null };
    });
}
