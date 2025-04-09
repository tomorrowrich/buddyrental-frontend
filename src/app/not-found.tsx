"use client";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";

export function BuddyRentalNotfound() {
  const theme = useTheme();

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
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
          boxShadow: theme.shadows[3],
          backgroundColor: theme.palette.background.paper,
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
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main}, ${theme.palette.quinary.main})`,
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
          onClick={() => window.history.back()}
          sx={{
            py: 1,
            px: 3,
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: theme.shadows[3],
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
