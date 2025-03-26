import { useEffect, useState } from "react";
import { Avatar, Box, Paper, Typography, Button } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";
import { Chat, ChatMessage } from "@/api/chat/interface";
import { getChatMessages } from "@/api/chat/api";
import { useAuth } from "@/context/auth/auth";
import {  socket } from "@/api/chat/socket";

import { randomUUID } from "crypto";
import { connect } from "http2";

export function ChatWindow({
  selectedChat,
}: {
  selectedChat: { role: "buddy" | "customer" | null; chat: Chat | null };
}) {
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "buddy" }[]
  >([]);
  const [editDetails, setEditDetails] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState<string | null>(null);
  const [editEndTime, setEditEndTime] = useState<string | null>(null);
  const [editSelectedDate, setEditSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State สำหรับเปิด/ปิด Dialog
  const router = useRouter();
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketTransport, setSocketTransport] = useState("N/A");

  const { user } = useAuth();

  const role = selectedChat.role;
  const chat = selectedChat.chat;

  if (!chat) return;

  function reformatMessage(chat: Chat, message: ChatMessage): {
    id: string;
    text: string;
    sender: "user" | "buddy";
  } {
    return {
      id: message.id,
      text: message.content,
      sender: chat.customer.userId === user?.userId ? "user" : "buddy",
    };
  }

  const fetchChatHistory = async () => {
    const { success, messages: rawMessages } = await getChatMessages(chat.id);

    if (success) {
      const formattedMsg = rawMessages.map((msg: ChatMessage) => {
        return reformatMessage(chat, msg);
      });

      setMessages(formattedMsg);
    }
  };
  fetchChatHistory();

  useEffect(() => {
    if (socket.connected) {
      
    }

    function onConnect() {
      setSocketConnected(true);
      setSocketTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setSocketTransport(transport.name);
      })
    }

    function onDisconnect() {
      setSocketConnected(false);
      setSocketTransport("N/A");
    }

    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, reformatMessage(chat, message)]);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("message");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    }
  }, []);

  const sendMessage = (message: string) => {
    if (!chat) return;
    socket.emit("message", {
      trackId: randomUUID().toString(),
      chatId: chat.id,
      senderId: user?.userId,
      content: message,
      meta: { metaId: randomUUID().toString(), timestamp: new Date(), type: "text" }
    });
  }

  const handleEditBooking = (message: string) => {
    // แยกข้อมูลจากข้อความที่ได้รับ
    const parts = message.split("\n");
    const dateAndTime = parts[2].split(" Time: ")[1];
    const [startTime, endTime] = dateAndTime.split(" - ");
    setEditDetails(parts[1].split(": ")[1] || "");
    setEditSelectedDate(parts[2].split(": ")[1] || "");
    setEditStartTime(startTime || "10:00");
    setEditEndTime(endTime || "15:00");

    // เปิด Dialog เมื่อคลิก "Edit Booking"
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
      }}
    >
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
                : chat?.buddy.profilePicture
            }
            sx={{ width: 50, height: 50 }}
          />
          <Typography fontWeight="bold">
            {role === "buddy"
              ? chat?.customer.displayName
              : chat?.buddy.displayName}
          </Typography>
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
            onClick={() => setOpenDialog(true)} // เปิด Dialog เมื่อคลิกปุ่ม Edit Booking
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
        sx={{
          height: "60vh",
          overflowY: "auto",
          p: 2,
          bgcolor: "rgba(235, 123, 192, 0.1)",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {messages.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No messages yet.
          </Typography>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                p: 1,
                maxWidth: "70%",
                borderRadius: 2,
                bgcolor: msg.sender === "user" ? "#EB7BC0" : "#EED5C2",
                color: "white",
                alignSelf: "flex-end",
                mb: 1,
              }}
            >
              <Typography
                component="span"
                sx={{ whiteSpace: "pre-wrap", color: "white" }}
              >
                {msg.text}
              </Typography>

              {msg.text.includes("Buddy Reservation Request") && (
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
                    onClick={() => handleEditBooking(msg.text)} // เมื่อคลิก "Edit Booking"
                  >
                    Edit Booking
                  </Button>
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* แสดง Dialog เมื่อ openDialog เป็น true */}
      <BookingDialog
        onSendMessage={sendMessage}
        editDetails={editDetails}
        editStartTime={editStartTime}
        editEndTime={editEndTime}
        editSelectedDate={editSelectedDate}
        setEditDetails={setEditDetails}
        setEditStartTime={setEditStartTime}
        setEditEndTime={setEditEndTime}
        setEditSelectedDate={setEditSelectedDate}
        open={openDialog} // ส่งค่า open ให้กับ Dialog
        setOpen={setOpenDialog} // ฟังก์ชันสำหรับปิด Dialog
      />
      <MessageInput onSendMessage={sendMessage} />
    </Paper>
  );
}
