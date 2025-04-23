"use client";
import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Chat } from "@/api/chat/interface";
import SidebarSwitcher from "@/widgets/Chat/SidebarSwitcher"; // ใช้ SidebarSwitcher แทน ChatSidebar

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{
    role: "buddy" | "customer" | null;
    chat: Chat | null;
  }>({
    role: null,
    chat: null,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSelectChat = (role: "buddy" | "customer", chat: Chat) => {
    setSelectedChat({ role, chat });
  };

  const handleBack = () => {
    setSelectedChat({ role: null, chat: null });
  };

  return (
    <Box
      display="flex"
      flex={1}
      bgcolor="#F7F7F7"
      p={isMobile ? 1 : 3}
      gap={1}
      position="relative"
      height="100vh"
      flexDirection="row"
    >
      <SidebarSwitcher
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onBack={handleBack}
        isMobile={isMobile}
      />
    </Box>
  );
}
