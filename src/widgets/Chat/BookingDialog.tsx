import {
  Button,
  Dialog,
  Card,
  Typography,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState, useEffect } from "react";

export function BookingDialog({
  onSendMessage,
  editDetails,
  editStartTime,
  editEndTime,
  editSelectedDate,
  setEditDetails,
  setEditStartTime,
  setEditEndTime,
  setEditSelectedDate,
  open,
  setOpen,
}: {
  onSendMessage: (text: string) => void;
  editDetails: string | null;
  editStartTime: string | null;
  editEndTime: string | null;
  editSelectedDate: string | null;
  setEditDetails: (value: string) => void;
  setEditStartTime: (value: string) => void;
  setEditEndTime: (value: string) => void;
  setEditSelectedDate: (value: string) => void;
  open: boolean; // รับ prop open จาก Parent
  setOpen: (value: boolean) => void; // รับ prop setOpen จาก Parent
}) {
  const [details, setDetails] = useState(editDetails || "");
  const [startTime, setStartTime] = useState(editStartTime || "10:00");
  const [endTime, setEndTime] = useState(editEndTime || "15:00");
  const [selectedDate, setSelectedDate] = useState<string>(
    editSelectedDate || "",
  );

  // เมื่อ props ที่ใช้สำหรับแก้ไขข้อมูลการจองเปลี่ยนแปลง, ให้ตั้งค่าใหม่ใน state
  useEffect(() => {
    setDetails(editDetails || "");
    setStartTime(editStartTime || "10:00");
    setEndTime(editEndTime || "15:00");
    setSelectedDate(editSelectedDate || "");
  }, [editDetails, editStartTime, editEndTime, editSelectedDate]);

  const handleBook = () => {
    if (!selectedDate) return; // ห้ามส่งถ้าไม่มีวันที่เลือก

    // สร้างข้อความใหม่ที่แก้ไขแล้ว
    const message = `**Buddy Reservation Request**\nDetails: ${details || "No details provided."}\nDate: ${selectedDate} Time: ${startTime} - ${endTime}`;

    onSendMessage(message); // ส่งข้อความใหม่ไปยัง Parent Component
    setOpen(false); // ปิด Dialog หลังจากส่ง
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Booking Alexa Rawles
          </Typography>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={500}>
              Details
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={1}
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                setEditDetails(e.target.value); // อัพเดทค่าใน parent
              }}
              placeholder="Type your details here..."
              sx={{ mt: 1 }}
            />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={500}>
              Pick a Date and Time
            </Typography>
          </Box>

          <Grid container spacing={0} mt={0}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  onChange={(date) => {
                    const formattedDate = date?.format("YYYY-MM-DD") || "";
                    setSelectedDate(formattedDate);
                    setEditSelectedDate(formattedDate); // อัพเดทค่าใน parent
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Start Time
                  </Typography>
                  <TextField
                    fullWidth
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setEditStartTime(e.target.value); // อัพเดทค่าใน parent
                    }}
                    sx={{ width: "200px" }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    End Time
                  </Typography>
                  <TextField
                    fullWidth
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setEditEndTime(e.target.value); // อัพเดทค่าใน parent
                    }}
                    sx={{ width: "200px" }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
              onClick={handleBook}
            >
              Book
            </Button>
          </Box>
        </Card>
      </Dialog>
    </>
  );
}
