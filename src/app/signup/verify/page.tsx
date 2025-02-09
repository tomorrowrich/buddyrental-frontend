"use client";
import { QontoConnector, QontoStepIcon } from "@/widgets/QontoConnector";
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

export default function VerificationPage() {
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
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Please wait for verification.
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Thanks for joining BuddyRental!
      </Typography>

      {/* Subtext */}
      <Typography variant="body1" color="secondary.main" sx={{ mb: 4 }}>
        Please wait for verification from admin. We will send you an email!
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={1} alternativeLabel connector={<QontoConnector />}>
          <Step key={"fill"}>
            <StepLabel slots={{ stepIcon: QontoStepIcon }}>
              Fill Information
            </StepLabel>
          </Step>
          <Step key={"verify"}>
            <StepLabel slots={{ stepIcon: QontoStepIcon }}>
              Verification
            </StepLabel>
          </Step>
          <Step key={"complete"}>
            <StepLabel slots={{ stepIcon: QontoStepIcon }}>Complete!</StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: "70%", px: 5, py: 1.5 }}
      >
        Thanks!
      </Button>
    </Container>
  );
}
