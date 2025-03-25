"use client";

import { getInterestSuggestions } from "@/api/interests/api";
import { updateInterests } from "@/api/users/api";
import { useAuth } from "@/context/auth/auth";
import { Interest } from "@/model/user";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "interests-onboarding";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(),
  );
  const [interests, setInterests] = useState<Interest[] | null>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getInterests = async () => {
      const { interests, error } = await getInterestSuggestions();
      if (interests) {
        setInterests(interests);
        console.log("Suggested Interests: ", interests);
      } else {
        console.error(error);
      }
    };

    getInterests();
  }, []);

  useEffect(() => {
    const storedInterests = localStorage.getItem(STORAGE_KEY);
    if (storedInterests) {
      setSelectedInterests(new Set(JSON.parse(storedInterests)));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedInterests]));
  }, [interests]);

  const handleSubmit = async () => {
    setSubmitting(true);

    const interests = Array.from(selectedInterests);

    const { success, error } = await updateInterests(interests);

    if (success) {
      localStorage.removeItem(STORAGE_KEY);
      router.push("/app/verify");
    } else {
      console.error(error);
    }

    setSubmitting(false);
  };

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
            {interests?.map((interest) => (
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
                onClick={() => router.push("/app/verify")}
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
