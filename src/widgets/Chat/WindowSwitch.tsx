"use client";

import { useMediaQuery } from "@mui/material";
import { ChatWindow } from "./ChatWindow";
import { ChatWindowMobile } from "./ChatWindowMobile";
import { Chat } from "@/api/chat/interface";

export default function ChatWindowSwitcher({
  selectedChat,
  onBack,
}: {
  selectedChat: { role: "buddy" | "customer" | null; chat: Chat | null };
  onBack: () => void;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <ChatWindowMobile selectedChat={selectedChat} onBack={onBack} />
  ) : (
    <ChatWindow selectedChat={selectedChat} />
  );
}
