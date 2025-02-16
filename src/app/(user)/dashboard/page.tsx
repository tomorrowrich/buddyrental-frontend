"use client";
import { Container, Typography } from "@mui/material";

export default function RootBuddyRentalPage() {
  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h4">Welcome to Buddy Rental</Typography>
      <Typography variant="body1">
        We&apos;re redirecting you to your buddy
      </Typography>
      <Typography variant="body2">Please hold on...</Typography>
    </Container>
  );
}
