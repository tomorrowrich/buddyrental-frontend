import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { getChatList } from "@/api/chat/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/auth";
import { Chat } from "@/api/chat/interface";

export function ChatSidebar({
  onSelectChat,
}: {
  onSelectChat: (role: "buddy" | "customer", chat: Chat) => void;
}) {
  const { user } = useAuth();

  const [chatList, setChatList] = useState<
    { name: string; avatar: string; role: "buddy" | "customer"; chat: Chat }[]
  >([]);

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

  return (
    <Paper sx={{ width: 320, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Chats
      </Typography>
      {chatList.map((chat, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(235, 123, 192, 0.1)",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => onSelectChat(chat.role, chat.chat)}
        >
          <Avatar src={chat.avatar} />
          <Box flexGrow={1}>
            <Typography fontWeight="medium">{chat.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {chat.chat.ChatMessage[0].content}
            </Typography>
          </Box>
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Box>
      ))}
    </Paper>
  );
}
