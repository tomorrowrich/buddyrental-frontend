"use client";
import { getUserReservationHistory } from "@/api/reservation/api";
import { Booking } from "@/model/reservation";
import { BookingHistory } from "@/widgets/Booking/BookingHistory/BookingHistory";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservationHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getUserReservationHistory();
        setBookingData(response.data);
      } catch (error) {
        console.error("Error fetching reservation history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationHistory();
  }, []);

  return (
    <Container sx={{ flex: 1, paddingTop: 5, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
          mb: 10,
          borderRadius: 8,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main} , ${theme.palette.quinary.main})`,
            padding: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "white",
              mt: 1,
            }}
          >
            Booking History
          </Typography>
        </Box>
        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          {isLoading ? (
            <Typography align="center" fontStyle="italic" m={2}>
              Loading booking history...
            </Typography>
          ) : bookingData.length === 0 ? (
            <Typography align="center" m={2}>
              No booking history found.
            </Typography>
          ) : (
            <BookingHistory data={bookingData} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
