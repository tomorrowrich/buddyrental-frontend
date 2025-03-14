import { useState } from "react";
import { Avatar, Box, Paper, Typography, Button } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";

export function ChatWindow({
  selectedChat,
}: {
  selectedChat: { name: string; avatar: string };
}) {
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "buddy" }[]
  >([]);
  const [editDetails, setEditDetails] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState<string | null>(null);
  const [editEndTime, setEditEndTime] = useState<string | null>(null);
  const [editSelectedDate, setEditSelectedDate] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State สำหรับเปิด/ปิด Dialog
  const router = useRouter();

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text,
        sender: "user",
      },
    ]);
  };

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
          <Avatar src={selectedChat.avatar} sx={{ width: 50, height: 50 }} />
          <Typography fontWeight="bold">{selectedChat.name}</Typography>
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
