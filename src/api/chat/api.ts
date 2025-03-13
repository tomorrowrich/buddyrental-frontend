"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getChatList = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getChatMessages = async (id: string) => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/chat/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const createChat = async (userId: string) => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  return data;
};
