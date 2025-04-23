import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { getChatList } from "@/api/chat/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/auth";
import { Chat } from "@/api/chat/interface";

export function ChatSidebar({
  selectChat,
  onSelectChat,
  selectedChatId,
}: {
  selectChat: string | null;
  onSelectChat: (role: "buddy" | "customer", chat: Chat) => void;
  selectedChatId?: string;
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

        if (selectChat) {
          const selectedChat = chatLists.find(
            (chat: {
              name: string;
              avatar: string;
              role: "buddy" | "customer";
              chat: Chat;
            }) => chat.chat.id === selectChat,
          );
          if (selectedChat) {
            onSelectChat(selectedChat.role, selectedChat.chat);
          }
        }
      }
    };
    fetchChatList();
  }, [user]);

  useEffect(() => {
    if (selectChat) {
      const selectedChat = chatList.find((chat) => chat.chat.id === selectChat);
      if (selectedChat) {
        onSelectChat(selectedChat.role, selectedChat.chat);
      }
    }
  }, [selectChat, chatList]);

  return (
    <Paper sx={{ width: 320, p: 2, boxShadow: 2 }}>
      <Typography variant="h6" mb={2}>
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
            }}
          />
          <Box flexGrow={1}>
            <Typography fontWeight={500}>{chat.name}</Typography>
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
              {chat.chat.ChatMessage[0]?.content}
            </Typography>
          </Box>
          <IconButton color="tertiary">
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Box>
      ))}
    </Paper>
  );
}
