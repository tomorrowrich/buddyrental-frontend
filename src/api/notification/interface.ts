export interface GetNotificationsParams {
  status?: "unread" | "all";
  page?: number;
  limit?: number;
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[] | null;
  pagination?: PaginationMetadata;
  error?: string | null;
}
