"use client";
import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTyping?: () => void;
}

export function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSendMessage(input);
    setInput(""); // Clear input after sending
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Trigger typing event
    if (onTyping) {
      onTyping();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      borderTop="1px solid #ddd"
      pt={2}
    >
      <TextField
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        multiline
        maxRows={3}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
