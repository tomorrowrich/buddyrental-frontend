"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Stack,
  Avatar,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Rating,
  useTheme,
  Grid2,
  Container,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { cancelReservation, getReservationStatus } from "@/api/reservation/api";
import { createReview } from "@/api/review/api";

// Review Dialog Component
const ReviewDialog = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewText: string, rating: number) => void;
}) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Write a Review</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Container>
          <Stack spacing={1} alignItems="center" my={4}>
            <Rating
              name="half-rating"
              size="large"
              precision={0.5}
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </Stack>
          <TextField
            label="Give your comment review !"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </Container>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3, mr: 4, m: 2 }}
          onClick={() => {
            if (rating) onSubmit(reviewText, rating);
          }}
          disabled={!rating}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Booking Card Component
export const ReviewCard = ({
  reservationId,
  name,
  email,
  avatar,
  citizenId,
  phoneNumber,
  address,
  reservationCreatedAt,
  reservationEnd,
  rating,
  tags,
}: {
  reservationId: string;
  name: string;
  email: string;
  avatar?: string;
  citizenId: string;
  phoneNumber: string;
  address: string;
  reservationCreatedAt: string;
  reservationEnd: string;
  rating: number;
  tags: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const theme = useTheme();

  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchReservationStatus = useCallback(async () => {
    try {
      const response = await getReservationStatus(reservationId);
      if (response.success) {
        setStatus(response.data.status);
      }
      if (response.error) {
        console.error(response.error);
        showSnackbar("Failed to fetch reservation status", "error");
      }
    } catch (error) {
      console.error("Failed to fetch reservation status:", error);
      showSnackbar("Failed to fetch reservation status", "error");
    }
  }, [reservationId]);

  useEffect(() => {
    if (open) {
      fetchReservationStatus();
    }
  }, [open, fetchReservationStatus]);

  const handleCancelReservation = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await cancelReservation(reservationId);
      // Update status locally instead of closing the dialog
      setStatus("CANCELLED");
      showSnackbar("Booking cancelled successfully", "success");
    } catch (error) {
      console.error("Error canceling booking:", error);
      showSnackbar("Failed to cancel booking", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (reviewText: string, rating: number) => {
    setIsLoading(true);
    try {
      await createReview({ reservationId, comment: reviewText, rating });
      showSnackbar("Review submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting review:", error);
      showSnackbar("Failed to submit review", "error");
    } finally {
      setIsLoading(false);
      handleCloseReview();
    }
  };

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
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
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="end" alignItems="center">
            <IconButton onClick={() => setOpen(false)}>
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
                    maxWidth: "200px",
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
                    <Rating
                      name="half-rating"
                      sx={{ color: theme.palette.tertiary.main }}
                      defaultValue={rating}
                      precision={0.5}
                      readOnly
                    />
                  </Stack>
                  <Typography variant="body2" color="secondary">
                    {email}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {tags.map((interest, index) => (
                      <Chip key={index} label={interest} color="default" />
                    ))}
                  </Stack>
                </Stack>
              </Grid2>
            </Grid2>

            <Box mb={4} mt={2}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Identity Card Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{citizenId}</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Phone Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{phoneNumber}</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Address
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{address}</Typography>
                </Grid2>
              </Grid2>
            </Box>

            <Stack direction="row" justifyContent="space-between" mt={3} mb={2}>
              {status === "COMPLETED" && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: 3 }}
                  onClick={handleOpenReview}
                >
                  Review
                </Button>
              )}
              {status === "CANCELLED" && (
                <Typography
                  variant="caption"
                  color="primary"
                  align="center"
                  fontWeight={400}
                >
                  Booking Cancelled
                </Typography>
              )}
              {status !== "COMPLETED" && status !== "CANCELLED" && (
                <Button
                  variant="outlined"
                  color="tertiary"
                  sx={{ borderRadius: 3 }}
                  onClick={handleCancelReservation}
                  disabled={isLoading}
                >
                  {isLoading ? "Cancelling..." : "Cancel Booking"}
                </Button>
              )}
              <Box textAlign="right">
                <Typography variant="body2" color="tertiary" fontWeight={400}>
                  Booking Date: {reservationCreatedAt}
                </Typography>
                <Typography variant="body2" color="tertiary" fontWeight={400}>
                  Hangout Date: {reservationEnd}
                </Typography>
              </Box>
            </Stack>
          </Container>
        </DialogContent>
      </Dialog>

      {/* Review Popup */}
      <ReviewDialog
        open={openReview}
        onClose={handleCloseReview}
        onSubmit={(reviewText: string, rating: number) =>
          handleSubmitReview(reviewText, rating)
        }
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
