// src/app/chat/page.tsx
"use client";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { ChatSidebar } from "@/widgets/Chat/ChatSidebar";
import { ChatWindow } from "@/widgets/Chat/ChatWindow";
import { ChatProvider, useChat } from "@/context/chat/chat";
import { useAuth } from "@/context/auth/auth"; // Assuming you have an auth hook

export default function ChatPage() {
  const { isAuthenticated } = useAuth(); // Get user and token from your auth context

  if (!isAuthenticated) {
    return <div>Please login to access chat</div>;
  }

  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}

function ChatLayout() {
  const { chats, activeChatId, setActiveChat } = useChat();

  // Handle initial active chat
  useEffect(() => {
    // If we have chats but no active chat, set the first one active
    const chatIds = Object.keys(chats);
    if (chatIds.length > 0 && !activeChatId) {
      setActiveChat(chatIds[0]);
    }
  }, [chats, activeChatId, setActiveChat]);

  // Get selected chat information from activeChatId
  const selectedChat = activeChatId ? chats[activeChatId] : null;

  return (
    <Box display="flex" height="100vh" bgcolor="#F7F7F7" p={3} gap={3}>
      <ChatSidebar
        onSelectChat={(chatId) => setActiveChat(chatId)}
        chats={Object.values(chats)}
        activeChatId={activeChatId}
      />
      {selectedChat && (
        <ChatWindow selectedChat={selectedChat} chatId={activeChatId!} />
      )}
    </Box>
  );
}
