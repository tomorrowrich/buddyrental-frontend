"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  Box,
  Typography,
  Grid2,
  TextField,
  Checkbox,
  Button,
  Link,
  FormControlLabel,
} from "@mui/material";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useRouter } from "next/router";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const STORAGE_KEY = "signupFormData";

export default function Signup({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identityCard: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newFormData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    router.replace("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid2 container sx={{ p: 2 }}>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            p: 12,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sign Up
          </Typography>
          <Typography color="quaternary" gutterBottom sx={{ mb: 4 }}>
            Let&rsquo;s get you all set up so you can access your personal
            account.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  required
                  fullWidth
                  name="identityCard"
                  label="Identity card Number"
                  value={formData.identityCard}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      I agree to all the{" "}
                      <Link href="/terms" color="tertiary">
                        Terms
                      </Link>
                      {" and "}
                      <Link href="/privacy_policies" color="tertiary">
                        Privacy Policies
                      </Link>
                    </Typography>
                  }
                />
              </Grid2>
            </Grid2>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2, color: "white", padding: 1.5 }}
            >
              Complete Profile
            </Button>
          </form>

          <Typography textAlign="center">
            Already have an account?{" "}
            <Link href="/signin" color="tertiary">
              Login
            </Link>
          </Typography>
        </Grid2>

        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: { xs: "300px", md: "600px" },
          }}
        >
          <LoginCarousel />
        </Grid2>
      </Grid2>
    </Box>
  );
}
