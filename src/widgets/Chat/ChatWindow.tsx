import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/chat/chat";

interface ChatWindowProps {
  selectedChat: {
    id: string;
    name: string;
    avatar: string;
    isTyping?: boolean;
  };
  chatId: string;
}

export function ChatWindow({ selectedChat, chatId }: ChatWindowProps) {
  const { messages, sendMessage, isLoading, socket } = useChat();
  const [editDetails, setEditDetails] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState<string | null>(null);
  const [editEndTime, setEditEndTime] = useState<string | null>(null);
  const [editSelectedDate, setEditSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get messages for this chat
  const chatMessages = messages[chatId] || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle typing notification
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    if (!socket) return;

    // Send typing status only if not already set
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("operation", `typing ${chatId} true`);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing notification after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("operation", `typing ${chatId} false`);
    }, 2000);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(chatId, text);
  };

  const handleEditBooking = (message: string) => {
    // Parse booking details from message
    const parts = message.split("\n");
    const dateAndTime = parts[2].split(" Time: ")[1];
    const [startTime, endTime] = dateAndTime.split(" - ");
    setEditDetails(parts[1].split(": ")[1] || "");
    setEditSelectedDate(parts[2].split("Date: ")[1]?.split(" Time:")[0] || "");
    setEditStartTime(startTime || "10:00");
    setEditEndTime(endTime || "15:00");

    // Open edit dialog
    setOpenDialog(true);
  };

  return (
    <Paper
      sx={{
        flex: 1,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={selectedChat.avatar} sx={{ width: 50, height: 50 }} />
          <Box>
            <Typography fontWeight="bold">{selectedChat.name}</Typography>
            {selectedChat.isTyping && (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                typing...
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => router.push("/app/profile/buddy")}
            sx={{
              bgcolor: "#EB7BC0",
              color: "white",
              "&:hover": { bgcolor: "#D667A7" },
            }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: "#EB7BC0",
              color: "white",
              "&:hover": { bgcolor: "#D667A7" },
            }}
          >
            Edit Booking
          </Button>
        </Box>
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "rgba(235, 123, 192, 0.1)",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          mb: 2,
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : chatMessages.length === 0 ? (
          <Typography
            color="text.secondary"
            textAlign="center"
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            No messages yet. Start a conversation!
          </Typography>
        ) : (
          chatMessages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                p: 2,
                maxWidth: "70%",
                borderRadius: 2,
                bgcolor: msg.senderId === "user" ? "#EB7BC0" : "#EED5C2",
                color: "white",
                alignSelf: msg.senderId === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Typography
                component="span"
                sx={{ whiteSpace: "pre-wrap", color: "white" }}
              >
                {msg.content}
              </Typography>

              {msg.content.includes("Buddy Reservation Request") && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ px: 4, mr: 1 }}
                    onClick={() => {
                      /* Handle Cancel Booking Action */
                    }}
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ px: 4, ml: 1 }}
                    onClick={() => handleEditBooking(msg.content)}
                  >
                    Edit Booking
                  </Button>
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* Booking Dialog */}
      <BookingDialog
        onSendMessage={handleSendMessage}
        editDetails={editDetails}
        editStartTime={editStartTime}
        editEndTime={editEndTime}
        editSelectedDate={editSelectedDate}
        setEditDetails={setEditDetails}
        setEditStartTime={setEditStartTime}
        setEditEndTime={setEditEndTime}
        setEditSelectedDate={setEditSelectedDate}
        open={openDialog}
        setOpen={setOpenDialog}
      />

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
    </Paper>
  );
}
