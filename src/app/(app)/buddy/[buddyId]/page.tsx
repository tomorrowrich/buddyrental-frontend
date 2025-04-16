import { getBuddy } from "@/api/buddy/api";
import { BuddyProfile } from "@/widgets/BuddyProfile";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Suspense } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

// Error component
function BuddyError({
  message,
  buddyId,
}: {
  message: string;
  buddyId: string;
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(124, 96, 107, 0.12)",
          border: "1px solid rgba(124, 96, 107, 0.15)",
          p: 4,
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

        <Typography
          variant="h4"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          Unable to Load Buddy Profile
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          component="p"
          sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
        >
          {message ||
            "We couldn't retrieve this buddy's information. This could be due to a network issue or the buddy profile may no longer exist."}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            href={`/app/buddy/${buddyId}`}
            sx={{ borderRadius: 2 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<HomeIcon />}
            href="/"
            sx={{ borderRadius: 2 }}
          >
            Return Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

// Server component to fetch buddy data
async function BuddyData({ buddyId }: { buddyId: string }) {
  try {
    const buddy = await getBuddy({ buddyId });

    if (!buddy) {
      return (
        <BuddyError
          buddyId={buddyId}
          message="The buddy profile you're looking for doesn't exist or has been removed."
        />
      );
    }

    return <BuddyProfile buddy={buddy} />;
  } catch (error) {
    console.error("Error fetching buddy data:", error);
    return (
      <BuddyError
        buddyId={buddyId}
        message="We encountered an error while trying to load this buddy's profile. Please try again later."
      />
    );
  }
}

// Loading component
function BuddyLoading() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <CircularProgress color="secondary" size={60} thickness={4} />
    </Container>
  );
}

type PageProps = {
  params: Promise<{
    buddyId: string;
  }>;
};

// Main export component
export default async function BuddyDetails({ params }: PageProps) {
  const buddyId = (await params).buddyId;

  return (
    <Suspense fallback={<BuddyLoading />}>
      <BuddyData buddyId={buddyId} />
    </Suspense>
  );
}
