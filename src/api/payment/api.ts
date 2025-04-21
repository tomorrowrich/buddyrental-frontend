"use server";
import axios from "axios";
import { baseURL } from "@/api";
import { cookies } from "next/headers";
import {
  PurchaseResponse,
  TransactionType,
  WithdrawCoinsResponse,
} from "./interface";
import { redirect } from "next/navigation";

export async function purchaseCoins(amount: number, redirectUrl: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await axios
    .post<PurchaseResponse>(
      `${baseURL}/payment/purchase`,
      {
        amount,
        type: "coin",
        redirectUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return {
        success: true,
        clientSecret: res.data.data.clientSecret,
        transaction: res.data.data.transaction,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        clientSecret: null,
        transaction: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

export async function getTransactionHistory(
  type?: TransactionType,
  take: number = 10,
  skip: number = 0,
) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let url = `${baseURL}/payment/history?take=${take}&skip=${skip}`;
  if (type || type == "") {
    url += `&type=${type}`;
  }

  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        totalCount: res.data.totalCount,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        totalCount: 0,
        error: err.response?.data?.message,
      };
    });
}

export async function withdrawCoins(amount: number) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await axios
    .post<WithdrawCoinsResponse>(`${baseURL}/payment/withdraw/${amount}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: true,
        transaction: res.data.data.transaction,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        transaction: null,
        error: err.response?.data?.message,
      };
    });
}
