import { Notification } from "@/model/notification";

export interface GetNotificationsParams {
  status?: "unread" | "all";
  page?: number;
  limit?: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  take: number;
  skip: number;
  totalCount: number;
}
