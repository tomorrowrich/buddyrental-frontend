"use client";
import { useState } from "react";
import { ChatSidebar } from "@/widgets/Chat/ChatSidebar";
import { ChatWindow } from "@/widgets/Chat/ChatWindow";
import { Box } from "@mui/material";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{
    name: string;
    avatar: string;
  }>({
    name: "Alexa Rawles",
    avatar: "https://picsum.photos/80",
  });

  const handleSelectChat = (name: string, avatar: string) => {
    setSelectedChat({ name, avatar });
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#F7F7F7" p={3} gap={3}>
      <ChatSidebar onSelectChat={handleSelectChat} />
      <ChatWindow selectedChat={selectedChat} />
    </Box>
  );
}
