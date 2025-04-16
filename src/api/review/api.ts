"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import { Review } from "@/model/review";
import { CreateReviewParams } from "./interface";

export async function createReview(data: CreateReviewParams): Promise<Review> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.post(`${baseURL}/reviews`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error creating review: ${error.response?.status}`);
    }
    throw error;
  }
}
