"use client";
import { useAuth } from "@/context/auth/auth";
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth/api";

export default function VerificationPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Use router.push instead of redirect
    }
  }, [user, router]);

  if (!user) {
    return null; // Prevent rendering the rest of the component before redirecting
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        mt: 10,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: "20px", sm: theme.typography.h4.fontSize },
        }}
      >
        Please wait for verification.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 2,
          fontSize: { xs: "20px", sm: theme.typography.h4.fontSize },
        }}
      >
        Thanks for joining BuddyRental!
      </Typography>

      <Typography variant="body1" color="secondary.main" sx={{ mb: 4 }}>
        Please wait for verification from admin. We will send you an email!
      </Typography>

      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={1} alternativeLabel>
          <Step key="fill">
            <StepLabel>Fill Information</StepLabel>
          </Step>
          <Step key="verify">
            <StepLabel>Verification</StepLabel>
          </Step>
          <Step key="complete">
            <StepLabel>Complete!</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          width: "70%",
          px: 5,
          py: 1.5,
          display: { xs: "none", sm: "inline-block" },
        }}
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Thanks!
      </Button>
    </Container>
  );
}
