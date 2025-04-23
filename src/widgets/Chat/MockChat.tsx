// mocks/mockChatList.ts
import { ChatMessageMetaType, ChatMessageStatus } from "@/api/chat/interface";

export const mockChatList = [
  {
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "customer" as "buddy" | "customer", // กำหนดให้ TypeScript รู้ว่าเป็น "buddy" หรือ "customer"
    chat: {
      id: "chat1",
      buddyId: "buddy1",
      customerId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ChatMessage: [
        {
          id: "msg1",
          chatId: "chat1",
          senderId: "buddy1",
          content: "Hello!",
          meta: {
            metaId: "meta1",
            timestamp: new Date(),
            type: ChatMessageMetaType.TEXT,
          },
          status: ChatMessageStatus.SENT,
          readAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ],
      buddy: {
        user: {
          displayName: "Buddy A",
          profilePicture: "https://i.pravatar.cc/150?img=2",
        },
      },
      customer: {
        displayName: "Alice Johnson",
        profilePicture: "https://i.pravatar.cc/150?img=1",
      },
    },
  },
  {
    name: "Brian Smith",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "buddy" as "buddy" | "customer", // ทำการแปลงให้เป็นประเภทที่ถูกต้อง
    chat: {
      id: "chat2",
      buddyId: "buddy2",
      customerId: "user2",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ChatMessage: [],
      buddy: {
        user: {
          displayName: "Brian Smith",
          profilePicture: "https://i.pravatar.cc/150?img=3",
        },
      },
      customer: {
        displayName: "Customer B",
        profilePicture: "https://i.pravatar.cc/150?img=4",
      },
    },
  },
  // เพิ่มรายการอื่นๆ
];
