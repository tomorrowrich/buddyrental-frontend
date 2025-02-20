"use client";

import { useAuth } from "@/context/auth/auth";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "interests-onboarding";

// TODO: Replace with actual interests
const interests = [
  { tagId: "art", name: "Art" },
  { tagId: "music", name: "Music" },
  { tagId: "sports", name: "Sports" },
  { tagId: "food", name: "Food" },
  { tagId: "travel", name: "Travel" },
  { tagId: "technology", name: "Technology" },
  { tagId: "science", name: "Science" },
  { tagId: "fashion", name: "Fashion" },
  { tagId: "fitness", name: "Fitness" },
  { tagId: "photography", name: "Photography" },
  { tagId: "books", name: "Books" },
  { tagId: "movies", name: "Movies" },
  { tagId: "games", name: "Games" },
  { tagId: "diy", name: "DIY" },
  { tagId: "pets", name: "Pets" },
  { tagId: "gardening", name: "Gardening" },
  { tagId: "cars", name: "Cars" },
  { tagId: "politics", name: "Politics" },
  { tagId: "health", name: "Health" },
  { tagId: "business", name: "Business" },
  { tagId: "education", name: "Education" },
  { tagId: "history", name: "History" },
  { tagId: "nature", name: "Nature" },
  { tagId: "culture", name: "Culture" },
  { tagId: "religion", name: "Religion" },
  { tagId: "lifestyle", name: "Lifestyle" },
  { tagId: "beauty", name: "Beauty" },
  { tagId: "home", name: "Home" },
  { tagId: "parenting", name: "Parenting" },
  { tagId: "relationships", name: "Relationships" },
  { tagId: "finance", name: "Finance" },
  { tagId: "shopping", name: "Shopping" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(),
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const interests = Array.from(selectedInterests);
    // TODO: Send selected interests to backend
    const { success, error } = (() => {
      console.log(interests);
      return {
        success: true,
        error: null,
      };
    })();

    if (success) {
      redirect("/verify");
    } else {
      // TODO: Handle error
      console.error(error);
    }

    setSubmitting(false);
  };

  useEffect(() => {
    const storedInterests = localStorage.getItem(STORAGE_KEY);
    console.log(storedInterests);
    if (storedInterests) {
      setSelectedInterests(new Set(JSON.parse(storedInterests)));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedInterests]));
  }, []);

  const handleChipClick = (interest: string) => {
    console.log(interest);
    const newInterests = new Set(selectedInterests);
    if (newInterests.has(interest)) {
      newInterests.delete(interest);
    } else {
      newInterests.add(interest);
    }
    setSelectedInterests(newInterests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newInterests)));
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
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mt={{ xs: 2, sm: 4 }}
          >
            {interests.map((interest) => (
              <Grid key={interest.tagId}>
                <Chip
                  label={interest.name}
                  variant={
                    selectedInterests.has(interest.tagId)
                      ? "filled"
                      : "outlined"
                  }
                  disabled={submitting}
                  clickable
                  color="primary"
                  onClick={() => handleChipClick(interest.tagId)}
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
                onClick={() => redirect("/verify")}
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
