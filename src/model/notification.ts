export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  url: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export enum NotificationType {
  Booking = "Booking",
  Chat = "Chat",
  Others = "Others",
}

export interface NotificationContextElement {
  notification: Notification;
  markAsRead: () => void;
}
