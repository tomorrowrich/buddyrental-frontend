"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export function BuddyRentalNotfound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/");
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: 16,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "9rem",
            fontWeight: 700,
            color: "rgba(124, 96, 107, 0.1)",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mt: 2,
            background: "linear-gradient(90deg, tertiary.main, quinary.main)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, mb: 4 }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="tertiary"
          onClick={handleGoBack}
          sx={{
            py: 1,
            px: 3,
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
          }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}

export default BuddyRentalNotfound;
