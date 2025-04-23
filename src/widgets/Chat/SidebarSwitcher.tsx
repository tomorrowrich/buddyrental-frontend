"use client";

import { Box } from "@mui/material";
import { ChatWindowMobile } from "./ChatWindowMobile";
import { MobileChatSidebar } from "@/widgets/Chat/ChatSidebarMobile";
import { Chat } from "@/api/chat/interface";

export default function ChatAndSidebarSwitcher({
  selectedChat,
  onSelectChat,
  onBack,
}: {
  selectedChat: { role: "buddy" | "customer" | null; chat: Chat | null };
  onSelectChat: (role: "buddy" | "customer", chat: Chat) => void;
  onBack: () => void;
}) {
  return (
    <>
      {/* แสดง Sidebar เมื่อยังไม่เลือกแชท */}
      {!selectedChat.chat && (
        <Box
          sx={{
            width: "100%",
            display: "block",
            mb: 2,
          }}
        >
          <MobileChatSidebar onSelectChat={onSelectChat} />
        </Box>
      )}

      {/* แสดงหน้าต่างแชทเมื่อเลือกแชทแล้ว */}
      {selectedChat.chat && (
        <Box
          sx={{
            width: "100%",
            display: "block",
            mb: 2,
          }}
        >
          <ChatWindowMobile selectedChat={selectedChat} onBack={onBack} />
        </Box>
      )}
    </>
  );
}
