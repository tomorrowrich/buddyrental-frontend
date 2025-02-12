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
} from "@mui/material";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";

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
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {/* Left half */}
        <Grid2
          size={6}
          sx={{
            width: { xs: "100%", md: "50%" },
            maxWidth: "600px",
            mx: 15,
            my: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Sign Up
          </Typography>
          <Typography color="#ffffff00" gutterBottom>
            empty
          </Typography>
          <Typography color="quaternary" gutterBottom>
            Let&rsquo;s get you all set up so you can access your personal
            account.
          </Typography>
          <Typography color="#ffffff00" gutterBottom>
            empty
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
              <TextField
                required
                name="firstName"
                label="First name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                required
                name="lastName"
                label="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}>
              <TextField
                required
                name="identityCard"
                label="Identity card Number"
                value={formData.identityCard}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                required
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}>
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}>
              <TextField
                required
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </Box>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                {...label}
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
              <Typography>
                {"I agree to all the "}
                <Link href="/terms" color="tertiary">
                  Terms
                </Link>
                {" and "}
                <Link href="/privacy_policies" color="tertiary">
                  Privacy Policies
                </Link>
              </Typography>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, color: "white", padding: 1.5 }}
            >
              Complete Profile
            </Button>
          </form>

          <Typography textAlign="center" sx={{ mt: 2 }}>
            {"Already have an account? "}
            <Link href="/completeprofile" color="tertiary">
              Login
            </Link>
          </Typography>
        </Grid2>

        {/* Right half */}
        <Grid2
          size={6}
          sx={{
            width: { xs: "100%", md: "50%" },
            minHeight: "500px",
            maxWidth: "600px",
          }}
        >
          <LoginCarousel />
        </Grid2>
      </Grid2>
    </Box>
  );
}
