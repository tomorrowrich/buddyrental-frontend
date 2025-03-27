import { useEffect, useState, useRef } from "react";
import { Avatar, Box, Paper, Typography, Button } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";
import { Chat, ChatMessage, ChatMessageMetaType } from "@/api/chat/interface";
import { getChatMessages } from "@/api/chat/api";
import { useAuth } from "@/context/auth/auth";
import { subscribeToMessages, sendMessage } from "@/api/chat/socket";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/context/socket/SocketProvider";

export function ChatWindow({
  selectedChat,
}: {
  selectedChat: { role: "buddy" | "customer" | null; chat: Chat | null };
}) {
  const [messages, setMessages] = useState<
    {
      id: string;
      text: string;
      sender: "user" | "buddy";
    }[]
  >([]);
  const [editDetails, setEditDetails] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState<string | null>(null);
  const [editEndTime, setEditEndTime] = useState<string | null>(null);
  const [editSelectedDate, setEditSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { socket } = useSocket();
  const role = selectedChat.role;
  const chat = selectedChat.chat;

  // Format a message for display
  function reformatMessage(
    message: ChatMessage,
    isFromUser: boolean,
  ): {
    id: string;
    text: string;
    sender: "user" | "buddy";
  } {
    return {
      id: message.id,
      text: message.content,
      sender: isFromUser ? "user" : "buddy",
    };
  }

  useEffect(() => {
    setSocketConnected(socket?.connected || false);
  }, [socket]);

  // Fetch chat history when a chat is selected
  useEffect(() => {
    if (!chat || !user) return;

    // Reset messages when changing chats
    setMessages([]);

    const fetchChatHistory = async () => {
      try {
        const { success, messages: rawMessages } = await getChatMessages(
          chat.id,
        );

        if (success && rawMessages) {
          const formattedMessages = rawMessages.map((msg: ChatMessage) => {
            const isFromUser = msg.senderId === user.userId;
            return reformatMessage(msg, isFromUser);
          });

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [chat, user]);

  // Subscribe to messages for the selected chat
  useEffect(() => {
    if (!chat || !user) return;

    const unsubscribe = subscribeToMessages((newMessage: ChatMessage) => {
      const isFromUser = newMessage.senderId === user.userId;
      setMessages((prev) => [...prev, reformatMessage(newMessage, isFromUser)]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chat, user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!chat || !user) return;

    // Add message to local state immediately (optimistic UI update)
    const newMessage = {
      id: uuidv4(),
      text: message,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Send message to server
    sendMessage({
      trackId: uuidv4(),
      chatId: chat.id,
      senderId: user.userId,
      content: message,
      meta: {
        metaId: uuidv4(),
        timestamp: new Date(),
        type: ChatMessageMetaType.TEXT,
      },
    });
  };

  const handleEditBooking = (message: string) => {
    // Split the message to extract booking details
    const parts = message.split("\n");
    if (parts.length < 3) return;

    // Extract date and time information
    const dateTimeString = parts[2].includes("Time:")
      ? parts[2].split("Time: ")[1]
      : "";

    const [startTime, endTime] = dateTimeString.includes(" - ")
      ? dateTimeString.split(" - ")
      : ["10:00", "15:00"];

    // Set the extracted details to state
    setEditDetails(parts[1].includes(": ") ? parts[1].split(": ")[1] : "");
    setEditSelectedDate(
      parts[2].includes("Date: ")
        ? parts[2].split("Date: ")[1].split(" Time")[0]
        : "",
    );
    setEditStartTime(startTime);
    setEditEndTime(endTime);

    // Open the dialog
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
        height: "90vh",
        maxHeight: "90vh",
      }}
    >
      {/* Chat header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={
              role === "buddy"
                ? chat?.customer.profilePicture
                : chat?.buddy?.user?.profilePicture
            }
            sx={{ width: 50, height: 50 }}
          />
          <Typography fontWeight="bold">
            {role === "buddy"
              ? chat?.customer.displayName
              : chat?.buddy?.user?.displayName}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
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
            variant="contained"
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

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "rgba(235, 123, 192, 0.1)",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          mb: 2,
        }}
      >
        {!chat ? (
          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{ alignSelf: "center", margin: "auto" }}
          >
            Select a chat to start messaging
          </Typography>
        ) : messages.length === 0 ? (
          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{ alignSelf: "center", margin: "auto" }}
          >
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                p: 2,
                maxWidth: "70%",
                borderRadius: 2,
                bgcolor: msg.sender === "user" ? "#EB7BC0" : "#EED5C2",
                color: msg.sender === "user" ? "white" : "#7C606B",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1.5,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {msg.text}
              </Typography>

              {msg.text.includes("Buddy Reservation Request") && (
                <Box display="flex" justifyContent="center" mt={2} gap={1}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {
                      /* Handle Cancel Booking Action */
                      handleSendMessage("I would like to cancel this booking.");
                    }}
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEditBooking(msg.text)}
                  >
                    Edit Booking
                  </Button>
                </Box>
              )}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Booking dialog */}
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

      {/* Message input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!chat || !socketConnected}
      />

      {/* Connection status indicator */}
      {!socketConnected && (
        <Typography
          color="error"
          variant="caption"
          sx={{ position: "absolute", bottom: 2, right: 12 }}
        >
          Reconnecting to server...
        </Typography>
      )}
    </Paper>
  );
}
