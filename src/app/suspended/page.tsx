"use client";

import { useAuth } from "@/context/auth/auth";
import { User } from "@/model/user";
import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function SuspendedPage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const suspendedUntil = user?.suspendedUntil;

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const isTemporarilySuspended =
    suspendedUntil && new Date(suspendedUntil).getTime() > Date.now();

  const formattedDate = suspendedUntil
    ? new Date(suspendedUntil).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : null;

  const message = isTemporarilySuspended ? (
    <Typography variant="h4" fontWeight={700} color="error" gutterBottom>
      Your account has been temporarily suspended until {formattedDate}.
    </Typography>
  ) : (
    <Typography variant="h4" fontWeight={700} color="error" gutterBottom>
      Your account has been permanently banned.
    </Typography>
  );

  return (
    <Container sx={{ py: 10 }}>
      <Box
        sx={{
          bgcolor: "#fff",
          p: 5,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: 600,
          mx: "auto",
          border: "1.5px solid #7C606B",
        }}
      >
        {message}
        <Typography variant="body1" mt={2}>
          If you believe this is a mistake, please contact us at{" "}
          <a style={{ color: "#7C606B" }}>admin@buddy.rental</a>
        </Typography>
      </Box>
    </Container>
  );
}
