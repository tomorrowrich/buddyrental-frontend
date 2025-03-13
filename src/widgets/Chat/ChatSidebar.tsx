import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Typography,
  Badge,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  chats: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage?: string;
    unreadCount: number;
    isTyping?: boolean;
  }>;
  activeChatId: string | null;
}

export function ChatSidebar({
  onSelectChat,
  chats,
  activeChatId,
}: ChatSidebarProps) {
  return (
    <Paper sx={{ width: 320, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Chats
      </Typography>

      {chats.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" p={2}>
          No chats available
        </Typography>
      ) : (
        chats.map((chat) => (
          <Box
            key={chat.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor:
                activeChatId === chat.id
                  ? "rgba(235, 123, 192, 0.3)"
                  : "rgba(235, 123, 192, 0.1)",
              cursor: "pointer",
              mb: 1,
              position: "relative",
            }}
            onClick={() => onSelectChat(chat.id)}
          >
            <Avatar src={chat.avatar} />
            <Box flexGrow={1}>
              <Typography fontWeight="medium">{chat.name}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {chat.isTyping ? (
                  <span style={{ fontStyle: "italic" }}>typing...</span>
                ) : chat.lastMessage?.content ? (
                  chat.lastMessage.content.substring(0, 30) +
                  (chat.lastMessage.content.length > 30 ? "..." : "")
                ) : (
                  "No messages yet"
                )}
              </Typography>
            </Box>

            {chat.unreadCount > 0 && (
              <Badge
                badgeContent={chat.unreadCount}
                color="error"
                sx={{ position: "absolute", top: 10, right: 10 }}
              />
            )}

            <IconButton>
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Box>
        ))
      )}
    </Paper>
  );
}
