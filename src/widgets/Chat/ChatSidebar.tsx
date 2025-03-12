import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export function ChatSidebar({
  onSelectChat,
}: {
  onSelectChat: (name: string, avatar: string) => void;
}) {
  const chatList = [
    { name: "Alexa Rawles", avatar: "https://picsum.photos/80?random=1" },
    { name: "John Doe", avatar: "https://picsum.photos/80?random=2" },
    { name: "Emily Johnson", avatar: "https://picsum.photos/80?random=3" },
    { name: "Michael Smith", avatar: "https://picsum.photos/80?random=4" },
    { name: "Sophia Lee", avatar: "https://picsum.photos/80?random=5" },
  ];

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
          onClick={() => onSelectChat(chat.name, chat.avatar)}
        >
          <Avatar src={chat.avatar} />
          <Box flexGrow={1}>
            <Typography fontWeight="medium">{chat.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Last message...
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
