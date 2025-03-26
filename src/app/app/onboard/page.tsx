"use client";

import { useAuth } from "@/context/auth/auth";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const STORAGE_KEY = "interests-onboarding";

// Mock data interests (20 อัน)
const mockInterests = [
  { tagId: "1", name: "Music" },
  { tagId: "2", name: "Sports" },
  { tagId: "3", name: "Movies" },
  { tagId: "4", name: "Technology" },
  { tagId: "5", name: "Travel" },
  { tagId: "6", name: "Food" },
  { tagId: "7", name: "Gaming" },
  { tagId: "8", name: "Art" },
  { tagId: "9", name: "Fitness" },
  { tagId: "10", name: "Books" },
  { tagId: "11", name: "Photography" },
  { tagId: "12", name: "Coding" },
  { tagId: "13", name: "Fashion" },
  { tagId: "14", name: "Music Production" },
  { tagId: "15", name: "Science" },
  { tagId: "16", name: "Health" },
  { tagId: "17", name: "Finance" },
  { tagId: "18", name: "Business" },
  { tagId: "19", name: "Nature" },
  { tagId: "20", name: "Pets" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(),
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedInterests = localStorage.getItem(STORAGE_KEY);
    if (storedInterests) {
      setSelectedInterests(new Set(JSON.parse(storedInterests)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedInterests]));
  }, [selectedInterests]);

  const handleSubmit = async () => {
    setSubmitting(true);

    const interests = Array.from(selectedInterests);

    // Simulate an API request here for updating interests
    // const { success, error } = await updateInterests(interests);

    // Simulating success
    const success = true;
    if (success) {
      localStorage.removeItem(STORAGE_KEY);
      router.push("/app");
    } else {
      console.error("Error updating interests");
    }

    setSubmitting(false);
  };

  const handleChipClick = (interest: string) => {
    const newInterests = new Set(selectedInterests);
    if (newInterests.has(interest)) {
      newInterests.delete(interest);
    } else {
      newInterests.add(interest);
    }
    setSelectedInterests(newInterests);
  };

  return (
    !user?.verified && (
      <Container maxWidth="xl">
        <Stack alignItems="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Choose your interests!
          </Typography>
          <Typography color="quaternary" gutterBottom>
            Pick your favorites to personalize your experience!
          </Typography>

          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            mt={{ xs: 2, sm: 4 }}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
            }}
          >
            {mockInterests.map((interest) => (
              <Grid key={interest.tagId}>
                <Chip
                  label={interest.name}
                  variant={
                    selectedInterests.has(interest.tagId)
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    selectedInterests.has(interest.tagId)
                      ? "tertiary"
                      : "primary"
                  }
                  onClick={() => handleChipClick(interest.tagId)}
                  sx={{
                    borderRadius: "16px",
                    padding: "8px 16px",
                    width: "100%",
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box width={{ xs: "100%", sm: "50%" }} mt={{ xs: 2, sm: 4 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              You can always change your interests later.
            </Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <Button
                variant="contained"
                color="quinary"
                disabled={submitting}
                onClick={() => router.push("/register/verify")}
                fullWidth
              >
                Skip
              </Button>
              <Button
                variant="contained"
                color="secondary"
                loading={submitting}
                onClick={handleSubmit}
                fullWidth
              >
                Done
              </Button>
            </Box>
          </Box>
        </Stack>
      </Container>
    )
  );
}
