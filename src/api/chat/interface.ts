export interface Chat {
  id: string;
  buddyId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ChatMessage: ChatMessage[];
  buddy: { user: UserInfo };
  customer: UserInfo;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  meta: ChatMessageMeta;
  status: ChatMessageStatus;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ChatMessageDTO {
  trackId: string;
  chatId: string;
  senderId: string;
  content: string;
  meta: ChatMessageMeta;
}

export interface UserInfo {
  displayName: string;
  profilePicture: string;
}

export interface ChatMessageMeta {
  metaId: string;
  timestamp: Date;
  type: ChatMessageMetaType;
  content?: string;
}

export enum ChatMessageMetaType {
  TEXT = "text",
  IMAGE = "image",
  APPOINTMENT = "appointment",
  FILE = "file",
}

export enum ChatMessageStatus {
  SENT = "sent",
  WAITING = "waiting",
  READ = "read",
}
