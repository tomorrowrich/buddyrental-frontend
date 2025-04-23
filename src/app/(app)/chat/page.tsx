"use client";
import { useCallback, useState } from "react";
import { ChatSidebar } from "@/widgets/Chat/ChatSidebar";
import { ChatWindow } from "@/widgets/Chat/ChatWindow";
import { Box } from "@mui/material";
import { Chat } from "@/api/chat/interface";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<{
    role: "buddy" | "customer" | null;
    chat: Chat | null;
  }>({
    role: null,
    chat: null,
  });

  const chatQueryParam = searchParams.get("chat") || null;

  const createChatQueryParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("chat", value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSelectChat = (role: "buddy" | "customer", chat: Chat) => {
    router.push(`/chat?${createChatQueryParam(chat.id)}`);
    setSelectedChat({ role, chat });
  };

  return (
    <Box display="flex" flex={1} bgcolor="#F7F7F7" p={3} gap={1}>
      <ChatSidebar
        selectChat={chatQueryParam}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChat.chat?.id}
      />
      <ChatWindow selectedChat={selectedChat} />
    </Box>
  );
}
