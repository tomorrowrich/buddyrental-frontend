import { createReservation } from "@/api/reservation/api";
import {
  Button,
  Dialog,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  DialogContent,
  DialogActions,
  Grid2,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { useState } from "react";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleBook = async () => {
    if (!selectedDate) {
      setSnackbarMessage("Please select a date");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    // Make API call to save booking
    const response = await createReservation({
      buddyId: buddyId,
      detail: detail,
      reservationStart: `${selectedDate}T${startTime}:00Z`,
      reservationEnd: `${selectedDate}T${endTime}:00Z`,
      price: price ? Number(price) : 0,
    });

    console.log(response);

    if (response && response.success) {
      // Create message to display in chat
      // const message = `**Buddy Reservation Request**\nDetails: ${detail || "No details provided."}\nPrice: $${price || "0"}\nDate: ${selectedDate} Time: ${startTime} - ${endTime}`;

      // Send message to parent component
      if (onSendMessage) {
        onSendMessage(response.data.data.reservation);
      }

      // Show success message
      setSnackbarMessage("Booking successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Close dialog
      setOpen(false);
    } else {
      console.error("Booking failed:", response?.error);
      setSnackbarMessage(
        response?.error || "Failed to create booking. Please try again.",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setLoading(false);
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
        maxWidth="md"
        scroll="paper"
        fullScreen={isMobile}
      >
        <DialogContent dividers={true}>
          <Typography variant="h6" fontWeight={600}>
            Booking with {buddyName}
          </Typography>
          <Grid2 container spacing={4} mt={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={detail}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Type your details here..."
                label="Details"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                  },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                label="Price"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <>
                        <MonetizationOnIcon
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography>$</Typography>
                      </>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box display="flex" alignItems="center">
                <CalendarMonthIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="subtitle1" fontWeight={500}>
                  Pick a Date
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    onChange={(date) => {
                      const formattedDate = date?.format("YYYY-MM-DD") || "";
                      setSelectedDate(formattedDate);
                    }}
                    sx={{
                      width: "100%",
                      maxWidth: "350px",
                      transform: isMobile ? "scale(0.9)" : "none",
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="subtitle1" fontWeight={500}>
                  Select Time
                </Typography>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Box mb={3} width="100%">
                    <Typography variant="subtitle1" fontWeight={500}>
                      Start Time
                    </Typography>
                    <MobileTimePicker
                      value={dayjs(`2022-01-01T${startTime}`)}
                      onChange={(newValue) => {
                        if (newValue) {
                          setStartTime(newValue.format("HH:mm"));
                        }
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>

                  <Box width="100%">
                    <Typography variant="subtitle1" fontWeight={500}>
                      End Time
                    </Typography>
                    <MobileTimePicker
                      value={dayjs(`2022-01-01T${endTime}`)}
                      onChange={(newValue) => {
                        if (newValue) {
                          setEndTime(newValue.format("HH:mm"));
                        }
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4 }}
            onClick={handleBook}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Booking..." : "Book Now"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
