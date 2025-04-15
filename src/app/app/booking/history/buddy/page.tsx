"use client";
import { getBuddyReservationHistory } from "@/api/reservation/api";
import { Reservation } from "@/model/reservation";
import { ReservationHistory } from "@/widgets/Booking/ReservationHistory/ReservationHistory";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const [bookingData, setBookingData] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservationHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getBuddyReservationHistory();
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
          borderRadius: 2,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main} , ${theme.palette.quinary.main})`,
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          Booking History
        </Typography>
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
            <ReservationHistory data={bookingData} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
