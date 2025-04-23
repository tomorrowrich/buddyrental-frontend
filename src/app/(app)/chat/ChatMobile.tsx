"use client";
import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ---------- Mock ChatWindow ----------
function MockChatWindow({
  chatId,
  goBack,
}: {
  chatId: string;
  goBack: () => void;
}) {
  const mockChatInfo = {
    name: chatId === "1" ? "John Doe" : "Support Team",
    avatar: chatId === "1" ? "/avatar1.png" : "/avatar2.png",
    messages: [
      { from: "them", text: "Hello!" },
      { from: "me", text: "Hi, what's up?" },
      { from: "them", text: "Just checking in." },
    ],
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column" bgcolor="#F0F0F0">
      <Box
        display="flex"
        alignItems="center"
        p={1}
        bgcolor="#fff"
        boxShadow={1}
      >
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar src={mockChatInfo.avatar} sx={{ mx: 1 }} />
        <Typography variant="subtitle1">{mockChatInfo.name}</Typography>
      </Box>

      <Box flex={1} overflow="auto" p={2}>
        <List>
          {mockChatInfo.messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{
                justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <ListItemText
                primary={msg.text}
                sx={{
                  bgcolor: msg.from === "me" ? "#DCF8C6" : "#FFF",
                  p: 1,
                  borderRadius: 2,
                  maxWidth: "70%",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

// ---------- Chat List ----------
const mockChats = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "See you tomorrow!",
    avatar: "/avatar1.png",
  },
  {
    id: "2",
    name: "Support Team",
    lastMessage: "Your ticket has been updated.",
    avatar: "/avatar2.png",
  },
];

// ---------- Main Mobile Chat Page ----------
export default function MobileChatMock() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (selectedChatId) {
    return (
      <MockChatWindow
        chatId={selectedChatId}
        goBack={() => setSelectedChatId(null)}
      />
    );
  }

  return (
    <Box height="100vh" overflow="auto" bgcolor="#fff">
      <List>
        {mockChats.map((chat) => (
          <Box key={chat.id}>
            <ListItemButton onClick={() => setSelectedChatId(chat.id)}>
              <Avatar src={chat.avatar} sx={{ mr: 2 }} />
              <ListItemText
                primary={chat.name}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {chat.lastMessage}
                  </Typography>
                }
              />
            </ListItemButton>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
