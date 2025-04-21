import { useEffect, useState, useRef } from "react";
import { Avatar, Box, Paper, Typography, Button } from "@mui/material";
import { BookingDialog } from "../Booking/BookingDialog";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";
import { Chat, ChatMessage, ChatMessageMetaType } from "@/api/chat/interface";
import { getChatMessages } from "@/api/chat/api";
import { useAuth } from "@/context/auth/auth";
import { subscribeToMessages, sendMessage } from "@/api/chat/socket";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/context/socket/SocketProvider";
import { cancelReservation, createReservation } from "@/api/reservation/api";

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
      type: ChatMessageMetaType;
      metaContent: string | undefined;
    }[]
  >([]);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

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
    type: ChatMessageMetaType;
    metaContent: string | undefined;
  } {
    return {
      id: message.id,
      text: message.content,
      sender: isFromUser ? "user" : "buddy",
      type: message.meta.type,
      metaContent: message.meta.content,
    };
  }

  useEffect(() => {
    setSocketConnected(socket?.connected || false);
  }, [socket]);

  // Set the container height on first render only
  useEffect(() => {
    if (containerRef.current && !containerHeight) {
      const height = containerRef.current.clientHeight;
      setContainerHeight(height);
    }
  }, []);

  // Handle window resize to adjust container height
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

          setMessages(formattedMessages.reverse());
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
      type: ChatMessageMetaType.TEXT,
      metaContent: undefined,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Send message to server
    sendMessage({
      trackId: uuidv4(),
      chatId: chat.id,
      senderId:
        role === "buddy" && user.buddy ? user.buddy?.buddyId : user.userId,
      content: message,
      meta: {
        metaId: uuidv4(),
        timestamp: new Date(),
        type: ChatMessageMetaType.TEXT,
      },
    });
  };

  const handleSendBookingMessage = async () => {
    if (!chat || !user) return;

    setOpenDialog(false);

    const reservation = await createReservation({
      buddyId: chat.buddyId,
      price: bookingPrice,
      detail: editDetails || "",
      reservationStart: new Date(
        `${editSelectedDate}T${editStartTime}`,
      ).toISOString(),
      reservationEnd: new Date(
        `${editSelectedDate}T${editEndTime}`,
      ).toISOString(),
    })
      .then((res) => {
        return res.data.data.reservation;
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
        throw error;
      });

    console.log("Reservation created:", reservation);

    const newMessage = {
      id: uuidv4(),
      text: `Buddy Reservation Request
${editDetails}
Date: ${editSelectedDate}
Time: ${editStartTime} - ${editEndTime}`,
      sender: "user" as const,
      type: ChatMessageMetaType.APPOINTMENT,
      metaContent: reservation.reservationId,
    };

    setMessages((prev) => [...prev, newMessage]);

    sendMessage({
      trackId: uuidv4(),
      chatId: chat.id,
      senderId:
        role === "buddy" && user.buddy ? user.buddy?.buddyId : user.userId,
      content: newMessage.text,
      meta: {
        metaId: uuidv4(),
        timestamp: new Date(),
        type: ChatMessageMetaType.APPOINTMENT,
        content: reservation.reservationId,
      },
    });
  };

  const handleEditBooking = (message: string) => {
    // Split the message to extract booking details
    const parts = message.split("\n");
    if (parts.length < 3) return;

    // Open the dialog
    setOpenDialog(true);
  };

  return (
    <Paper
      sx={{
        flex: 1,
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        overflow: "hidden",
        height: containerHeight ? `${containerHeight}px` : "auto",
      }}
      ref={containerRef}
    >
      {/* Chat header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        px={1}
      >
        <Box display="flex" alignItems="center" gap={2.5}>
          <Avatar
            src={
              role === "buddy"
                ? chat?.customer.profilePicture
                : chat?.buddy?.user?.profilePicture
            }
            sx={{
              width: 56,
              height: 56,
              boxShadow: 2,
            }}
          />
          <Typography variant="h6" fontWeight="600" color="text.primary">
            {role === "buddy"
              ? chat?.customer.displayName
              : chat?.buddy?.user?.displayName}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="quinary"
            onClick={() => router.push("/profile/buddy")}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              boxShadow: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            Profile
          </Button>
          <Button
            variant="contained"
            color="tertiary"
            onClick={() => setOpenDialog(true)}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              boxShadow: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
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
          p: 3,
          bgcolor: "rgba(238, 213, 194, 0.15)",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          mb: 3,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(124, 96, 107, 0.05)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(124, 96, 107, 0.2)",
            borderRadius: "10px",
            "&:hover": {
              background: "rgba(124, 96, 107, 0.3)",
            },
          },
        }}
      >
        {!chat ? (
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            sx={{
              alignSelf: "center",
              margin: "auto",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            Select a chat to start messaging
          </Typography>
        ) : messages.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            sx={{
              alignSelf: "center",
              margin: "auto",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                p: 2.5,
                maxWidth: "70%",
                borderRadius:
                  msg.sender === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                bgcolor:
                  msg.sender === "user" ? "tertiary.main" : "quinary.main",
                color: msg.sender === "user" ? "white" : "text.primary",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 2.5,
                boxShadow: 1,
                position: "relative",
                transition: "transform 0.1s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {msg.text}
              </Typography>

              {msg.type === ChatMessageMetaType.APPOINTMENT && (
                <Box display="flex" justifyContent="center" mt={3} gap={2}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      boxShadow: 1,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
                    onClick={async () => {
                      const { success } = await cancelReservation(
                        msg.metaContent as string,
                      );
                      if (success)
                        handleSendMessage(`Reservation Cancelled\n${msg.text}`);
                      if (!success)
                        handleSendMessage(
                          `Error cancelling reservation\n\nReservation ID: ${msg.metaContent}`,
                        );
                    }}
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      boxShadow: 1,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
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
      {role === "customer" && chat?.buddy && (
        <BookingDialog
          onSendMessage={handleSendMessage}
          buddyId={chat.buddyId!}
          buddyName={chat.buddy.user!.displayName}
          open={openDialog}
          setOpen={setOpenDialog}
        />
      )}

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
          fontWeight={500}
          sx={{
            position: "absolute",
            bottom: 4,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#F44336",
              marginRight: "6px",
            }}
          ></span>
          Reconnecting to server...
        </Typography>
      )}
    </Paper>
  );
}
