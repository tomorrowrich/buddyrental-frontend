"use client";
import { Box } from "@mui/material";
import { ChatSidebar } from "@/widgets/Chat/ChatSidebar";
import { MobileChatSidebar } from "@/widgets/Chat/ChatSidebarMobile";
import ChatWindowSwitcher from "@/widgets/Chat/WindowSwitch";
import { Chat } from "@/api/chat/interface";

export default function SidebarSwitcher({
  selectedChat,
  onSelectChat,
  onBack,
  isMobile,
}: {
  selectedChat: { role: "buddy" | "customer" | null; chat: Chat | null };
  onSelectChat: (role: "buddy" | "customer", chat: Chat) => void;
  onBack: () => void;
  isMobile: boolean;
}) {
  return (
    <>
      {/* For mobile, show ChatSidebar when no chat is selected */}
      {isMobile && !selectedChat.chat && (
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

      {/* For desktop, show the regular ChatSidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 320,
            display: "block",
            mb: 0,
          }}
        >
          <ChatSidebar
            onSelectChat={onSelectChat}
            selectedChatId={selectedChat.chat?.id}
          />
        </Box>
      )}

      {/* For mobile, hide ChatWindow if no chat is selected */}
      {(!isMobile || selectedChat.chat) && (
        <ChatWindowSwitcher selectedChat={selectedChat} onBack={onBack} />
      )}
    </>
  );
}
