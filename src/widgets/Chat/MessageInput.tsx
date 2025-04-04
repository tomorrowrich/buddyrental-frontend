import { useState, useEffect } from "react";
import { TextField, IconButton, Tooltip, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function MessageInput({
  onSendMessage,
  disabled = false,
}: {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <Box sx={{ position: "relative", width: "100%" }}>
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
        color="tertiary"
        slotProps={{
          input: {
            endAdornment: isMounted && (
              <Tooltip
                title={disabled ? "Connecting..." : "Send message"}
                placement="top"
                arrow
              >
                <IconButton
                  onClick={handleSend}
                  disabled={!message.trim() || disabled}
                  sx={{
                    bgcolor: message.trim() ? "tertiary.main" : "transparent",
                    color: message.trim() ? "white" : "text.secondary",
                    "&:hover": {
                      bgcolor: message.trim()
                        ? "secondary.main"
                        : "rgba(124, 96, 107, 0.08)",
                    },
                    borderRadius: 2.5,
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            color: "text.primary",
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "tertiary.main",
                borderWidth: 1.5,
              },
              boxShadow: 3,
            },
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "quaternary.light",
              },
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(124, 96, 107, 0.2)",
          },
          "& .MuiInputBase-input": {
            "&::placeholder": {
              color: "text.secondary",
              opacity: 0.6,
              fontStyle: "italic",
            },
          },
        }}
      />
    </Box>
  );
}
