"use client";
import {
  cancelReservation,
  completeReservation,
  confirmReservation,
  getReservationStatus,
  rejectReservation,
} from "@/api/reservation/api";
import { Check, Close } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

// Reservation Card Component
export const ReservationCard = ({
  reservationId,
  name,
  email,
  avatar,
  interests,
  phoneNumber,
  reservationCreatedAt,
  reservationStart,
  reservationEnd,
  detail,
}: {
  reservationId: string;
  name: string;
  email: string;
  avatar?: string;
  interests?: string[];
  citizenId: string;
  phoneNumber: string;
  address: string;
  reservationCreatedAt: string;
  reservationStart: string;
  reservationEnd: string;
  detail: string;
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservationStatus = useCallback(async () => {
    try {
      const response = await getReservationStatus(reservationId);
      if (response.success) {
        setStatus(response.data.status);
      }
      if (response.error) {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [reservationId]);

  useEffect(() => {
    fetchReservationStatus();
  }, [fetchReservationStatus]);

  const handleReject = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await rejectReservation(reservationId);
      setStatus("REJECTED");
    } catch (error) {
      console.error("Failed to reject reservation:", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await confirmReservation(reservationId);
      setStatus("ACCEPTED");
    } catch (error) {
      console.error("Failed to confirm reservation:", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await cancelReservation(reservationId);
      setStatus("CANCELLED");
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleComplete = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await completeReservation(reservationId);
      setStatus("COMPLETED");
    } catch (error) {
      console.error("Failed to complete reservation:", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={avatar} alt={name} />
          <Box>
            <Typography variant="body1" fontWeight={600} color="primary">
              {name}
            </Typography>
            <Typography variant="body2" color="secondary">
              {email}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3 }}
          onClick={() => setOpen(true)}
        >
          Details
        </Button>
      </Box>

      {/* Details Dialog */}
      <Dialog
        open={open}
        onClose={() => !isLoading && setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="end" alignItems="center">
            <IconButton
              onClick={() => !isLoading && setOpen(false)}
              disabled={isLoading}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Grid2
              size={{ sm: 4, md: 12 }}
              container
              spacing={2}
              alignItems="center"
            >
              <Grid2 size={5} alignItems={"center"} alignContent={"center"}>
                <Avatar
                  src={avatar}
                  alt={name}
                  sx={{
                    width: "80%",
                    maxWidth: "120px",
                    height: "auto",
                    aspectRatio: "1/1",
                  }}
                />
              </Grid2>
              <Grid2 size={7}>
                <Stack direction="column" spacing={2}>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography variant="h6" fontWeight={600}>
                      {name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="secondary">
                    {email}
                  </Typography>
                  {interests && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {interests.map((interest, index) => (
                        <Chip key={index} label={interest} color="default" />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Grid2>
            </Grid2>

            <Box mb={4} mt={2}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Phone Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Typography variant="body2">{phoneNumber}</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Hangout Date
                  </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Typography variant="body2" fontWeight={400}>
                    {reservationStart + " - " + reservationEnd}
                  </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Booking Date
                  </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Typography variant="body2" fontWeight={400}>
                    {reservationCreatedAt}
                  </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Detail
                  </Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Typography
                    variant="body2"
                    fontWeight={400}
                    sx={{
                      fontStyle: detail ? "normal" : "italic",
                      wordBreak: "break-word",
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                    }}
                  >
                    {detail || "No additional details provided"}
                  </Typography>
                </Grid2>
              </Grid2>
            </Box>
            {status === "COMPLETED" ||
            status === "CANCELLED" ||
            status === "REJECTED" ? (
              <Box textAlign="center" mt={3} mb={2}>
                <Typography variant="body1" color="text.secondary">
                  {status === "COMPLETED"
                    ? "This booking has been completed"
                    : status === "CANCELLED"
                      ? "This booking has been cancelled"
                      : "You have rejected this booking"}
                </Typography>
              </Box>
            ) : status === "PENDING" ? (
              <Stack
                direction="row"
                justifyContent="center"
                spacing={4}
                mt={3}
                mb={2}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<Close />}
                  onClick={handleReject}
                  disabled={isLoading}
                >
                  Reject booking
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<Check />}
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  Confirm booking
                </Button>
              </Stack>
            ) : status === "ACCEPTED" ? (
              <Stack
                direction="row"
                justifyContent="center"
                spacing={4}
                mt={3}
                mb={2}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<Close />}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel booking
                </Button>
                <Button
                  variant="contained"
                  color="quinary"
                  endIcon={<Check />}
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  Mark completed
                </Button>
              </Stack>
            ) : (
              <Box textAlign="center" mt={3} mb={2}>
                <Typography variant="body1" color="text.secondary">
                  Unknown booking status: {status}
                </Typography>
              </Box>
            )}
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};
