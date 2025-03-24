"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { LoginResponse, SignUpFormData } from "./interface";
import { cookies } from "next/headers";
import { User } from "@/model/user";

export async function register(data: SignUpFormData) {
  return axios
    .post(`${baseURL}/auth/register`, data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      return { success: true, data: res.data, error: null };
    })
    .catch((err) => {
      return { success: false, error: err, data: null };
    });
}

export async function login(email: string, password: string) {
  return await axios
    .post<LoginResponse>(`${baseURL}/auth/login` as string, {
      clientKey: process.env.CLIENT_KEY,
      email,
      password,
    })
    .then(async (res) => {
      const cookie = await cookies();
      cookie.set("token", res.data.accessToken, {
        partitioned: true,
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        httpOnly: true,
      });
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

export async function getProfile() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) {
    return { success: false, user: null, error: "Token not found" };
  }
  return axios
    .get<{ user: User }>(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      cookie.set("user", JSON.stringify(res.data.user), {
        partitioned: true,
        maxAge: 30,
        secure: true,
        httpOnly: true,
      });
      return { success: true, user: res.data.user, error: null };
    })
    .catch((error) => {
      return {
        success: false,
        user: null,
        error: error.response?.data?.message || "Unknown error",
      };
    });
}

export async function logout() {
  const cookie = await cookies();
  cookie.set("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    partitioned: true,
  });
  cookie.set("user", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    partitioned: true,
  });
  return { success: true };
}

export async function requestPasswordReset(email: string) {
  try {
    const response = await axios.post(
      `${baseURL}/users/reset-password`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    console.log("API response:", response);

    if (response.status === 200 && response.data.token) {
      return response.data.token;
    } else {
      throw new Error("No token returned or unexpected status");
    }
  } catch (err: unknown) {
    console.error("Request error:", err);

    if (axios.isAxiosError(err)) {
      return (
        err.response?.data?.message || "An error occurred during the request"
      );
    }

    return;
  }
}
