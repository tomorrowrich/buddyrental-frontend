"use client";
import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSendMessage(input);
    setInput(""); // เคลียร์ช่องข้อความ
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mt={2}
      borderTop="1px solid #ddd"
      pt={2}
    >
      {/* เพิ่ม value และ onChange */}
      <TextField
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()} // กด Enter เพื่อส่งข้อความ
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
