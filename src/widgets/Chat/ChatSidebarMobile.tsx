import { Avatar, Box, Paper, Typography } from "@mui/material";
import { ChatMessageStatus } from "@/api/chat/interface";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/auth";
import { Chat } from "@/api/chat/interface";

import { mockChatList } from "./MockChat";

export function MobileChatSidebar({
  onSelectChat,
  selectedChatId,
}: {
  onSelectChat: (role: "buddy" | "customer", chat: Chat) => void;
  selectedChatId?: string;
}) {
  const { user } = useAuth();
  const [chatList, setChatList] = useState<
    { name: string; avatar: string; role: "buddy" | "customer"; chat: Chat }[]
  >([]);

  useEffect(() => {
    setChatList(mockChatList);
  }, []);

  /*
  useEffect(() => {
    const fetchChatList = async () => {
      const { success, chats } = await getChatList();
      if (success) {
        const chatLists = chats.map((chat: Chat) => {
          if (chat.customerId === user?.userId) {
            return {
              name: chat.buddy.user.displayName,
              avatar: chat.buddy.user.profilePicture,
              role: "customer",
              chat: chat,
            };
          } else {
            return {
              name: chat.customer.displayName,
              avatar: chat.customer.profilePicture,
              role: "buddy",
              chat: chat,
            };
          }
        });
        setChatList(chatLists);
      }
    };
    fetchChatList();
  }, [user]);

  */
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        mx: "auto",
        p: 2,
        boxShadow: 2,
        maxHeight: "calc(100vh - 60px)",
        overflowY: "auto",
        position: "absolute",
        top: "10px",
        display: "block",
        borderRadius: 2,
        backgroundColor: "background.paper",
        left: 0,
        right: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: `linear-gradient(90deg, #FFB6C1, #FF69B4)`,
          p: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          marginBottom: 0,
        }}
      >
        <Typography variant="h6" color="white" fontWeight={700}>
          Chats
        </Typography>
      </Box>

      {/* Chat List */}
      {chatList.map((chat, index) => {
        const hasNewMessages = chat.chat.ChatMessage.some(
          (message) =>
            message.status === ChatMessageStatus.SENT && !message.readAt,
        );

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor:
                selectedChatId === chat.chat.id
                  ? "rgba(235, 123, 192, 0.2)"
                  : "transparent",
              cursor: "pointer",
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(235, 123, 192, 0.1)",
              },
            }}
            onClick={() => onSelectChat(chat.role, chat.chat)}
          >
            <Avatar
              src={chat.avatar}
              sx={{
                bgcolor: "quaternary.light",
                width: 48,
                height: 48,
              }}
            />

            <Box flexGrow={1} sx={{ overflow: "hidden" }}>
              <Typography fontWeight={600}>{chat.name}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "180px",
                }}
              >
                {chat.chat.ChatMessage[0]?.content || "No messages yet"}
              </Typography>
            </Box>

            <Box sx={{ width: 24, height: 24, position: "relative" }}>
              {hasNewMessages && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "secondary.main",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}
