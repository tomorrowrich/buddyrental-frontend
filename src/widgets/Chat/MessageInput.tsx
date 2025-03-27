import { useState } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function MessageInput({
  onSendMessage,
  disabled = false,
}: {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "relative",
      }}
    >
      <TextField
        fullWidth
        placeholder={disabled ? "Connecting..." : "Type a message..."}
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        multiline
        maxRows={3}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            pr: 5,
          },
        }}
      />
      <Tooltip title={disabled ? "Connecting..." : "Send message"}>
        <span>
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: message.trim() ? "#EB7BC0" : "transparent",
              color: message.trim() ? "white" : "gray",
              "&:hover": {
                bgcolor: message.trim() ? "#D667A7" : "transparent",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
