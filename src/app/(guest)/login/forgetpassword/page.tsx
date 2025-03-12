"use client";
import {
  Box,
  Typography,
  Button,
  Link,
  Container,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { useState, FormEvent } from "react";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useAuth } from "@/context/auth/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ email: event.target.value });
    if (errors.email) {
      setErrors({ email: "" });
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(values.email)) {
      // EDITED: Validate email
      setErrors({ email: "Invalid email format" });
      return;
    }

    router.push("/login/resetpassword"); // EDITED: Redirect if valid
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 4, md: 8 }}
        sx={{
          p: { xs: 2, sm: 4, md: 8 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            maxWidth: "100%",
            mx: "auto",
            my: "auto",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", p: { xs: 2, sm: 4 } }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Forget your password?
            </Typography>
            <Typography color="quaternary" gutterBottom>
              Don&rsquo;t worry, happens to all of us. Enter your email below to
              recover your password
            </Typography>

            <FormControl fullWidth margin="normal" error={!!errors.email}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                label="Email"
                autoFocus
                autoComplete="email"
                aria-describedby="email-helper-text"
              />
              {errors.email && (
                <FormHelperText id="email-helper-text">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, color: "white", padding: 1.5 }}
            >
              Login
            </Button>

            <Typography textAlign="center" sx={{ mt: 2 }}>
              {"Don't have an account? "}
              <Link href="/register" color="tertiary">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Carousel Section */}
        <Box
          sx={{
            minHeight: "500px",
            width: { xs: "100%", md: "50%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <LoginCarousel />
        </Box>
      </Stack>
    </Container>
  );
}
