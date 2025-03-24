"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { baseURL } from "..";
import { CreateReservationDto } from "./interface";

/**
 * Get reservation history as a buddy
 */
export async function getBuddyReservationHistory(
  take: number = 10,
  skip: number = 0,
) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return await axios
    .get(`${baseURL}/reservation/buddy-history`, {
      params: { take, skip },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        take: res.data.take,
        skip: res.data.skip,
        totalCount: res.data.totalCount,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Get reservation history as a user
 */
export async function getUserReservationHistory(
  take: number = 10,
  skip: number = 0,
) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .get(`${baseURL}/reservation/history`, {
      params: { take, skip },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        take: res.data.take,
        skip: res.data.skip,
        totalCount: res.data.totalCount,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Create a new reservation
 */
export async function createReservation(reservationData: CreateReservationDto) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .post(`${baseURL}/reservation`, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Confirm a reservation (for buddies)
 */
export async function confirmReservation(reservationId: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .patch(
      `${baseURL}/reservation/confirm/${reservationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Reject a reservation (for buddies)
 */
export async function rejectReservation(reservationId: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .patch(
      `${baseURL}/reservation/reject/${reservationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .patch(
      `${baseURL}/reservation/cancel/${reservationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}

/**
 * Mark a reservation as complete
 */
export async function completeReservation(reservationId: string) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return redirect("/login");
  }

  return await axios
    .patch(
      `${baseURL}/reservation/complete/${reservationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    })
    .catch((err) => {
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || "Unknown error",
      };
    });
}
