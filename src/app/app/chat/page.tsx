"use client";
import { useState } from "react";
import { ChatSidebar } from "@/widgets/Chat/ChatSidebar";
import { ChatWindow } from "@/widgets/Chat/ChatWindow";
import { Box } from "@mui/material";
import { Chat } from "@/api/chat/interface";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{
    role: "buddy" | "customer" | null;
    chat: Chat | null;
  }>({
    role: null,
    chat: null,
  });

  const handleSelectChat = (role: "buddy" | "customer", chat: Chat) => {
    setSelectedChat({ role, chat });
  };

  return (
    <Box display="flex" height="100%" flex={1} bgcolor="#F7F7F7" p={3} gap={3}>
      <ChatSidebar onSelectChat={handleSelectChat} />
      <ChatWindow selectedChat={selectedChat} />
    </Box>
  );
}
