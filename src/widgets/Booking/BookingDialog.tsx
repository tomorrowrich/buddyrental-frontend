import { createReservation } from "@/api/reservation/api";
import {
  Button,
  Dialog,
  Card,
  Typography,
  Box,
  TextField,
  Grid2,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

export function BookingDialog({
  open,
  setOpen,
  buddyId,
  buddyName,
  onSendMessage,
}: {
  buddyId: string;
  buddyName: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSendMessage?: (message: string) => void;
}) {
  const [detail, setDetails] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("15:00");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleBook = async () => {
    if (!selectedDate) {
      setSnackbarMessage("Please select a date");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      // Make API call to save booking
      await createReservation({
        buddyId: buddyId,
        detail: detail,
        reservationStart: `${selectedDate}T${startTime}:00Z`,
        reservationEnd: `${selectedDate}T${endTime}:00Z`,
        price: price ? Number(price) : 0,
      }).then(console.log);

      // Create message to display in chat
      const message = `**Buddy Reservation Request**\nDetails: ${detail || "No details provided."}\nPrice: $${price || "0"}\nDate: ${selectedDate} Time: ${startTime} - ${endTime}`;

      // Send message to parent component
      if (onSendMessage) {
        onSendMessage(message);
      }

      // Show success message
      setSnackbarMessage("Booking successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Close dialog
      setOpen(false);
    } catch (error) {
      console.error("Booking failed:", error);
      setSnackbarMessage("Failed to create booking. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
            Booking with {buddyName}
          </Typography>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={500}>
              Details
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={1}
              value={detail}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
              placeholder="Type your details here..."
              sx={{ mt: 1 }}
            />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={500}>
              Price
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="Enter price"
              slotProps={{
                input: {
                  startAdornment: <Typography>$</Typography>,
                },
              }}
              sx={{ mt: 1 }}
            />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={500}>
              Pick a Date and Time
            </Typography>
          </Box>

          <Grid2 container spacing={0} sx={{ mt: 0 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  onChange={(date) => {
                    const formattedDate = date?.format("YYYY-MM-DD") || "";
                    setSelectedDate(formattedDate);
                  }}
                />
              </LocalizationProvider>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
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
                    }}
                    sx={{ width: "200px" }}
                  />
                </Box>
              </Box>
            </Grid2>
          </Grid2>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
              onClick={handleBook}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Book"}
            </Button>
          </Box>
        </Card>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
