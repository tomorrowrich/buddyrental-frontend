"use client";
import { getUnverifiedUsers } from "@/api/verify/api";
import { User } from "@/model/user";
import { VerificationRequest } from "@/widgets/Verification/VerificationHistory/VerificationHistory";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[] | null>();

  const fetchUnverifiedUsers = async () => {
    try {
      const { success, users, error } = await getUnverifiedUsers();
      if (success) {
        console.log("Unverified users:", users);
        setUnverifiedUsers(users);
      } else {
        console.error("Failed to fetch unverified users:", error);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching unverified users:",
        error,
      );
    }
  };

  useEffect(() => {
    fetchUnverifiedUsers();
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
          backgroundColor: "white",
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
          Verification Management
        </Typography>
        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          <VerificationRequest
            data={unverifiedUsers ?? []}
            onChange={fetchUnverifiedUsers}
          />
        </Box>
      </Box>
    </Container>
  );
}
