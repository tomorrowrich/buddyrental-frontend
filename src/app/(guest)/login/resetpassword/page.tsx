"use client";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid2,
  TextField,
} from "@mui/material";
import { useState, FormEvent } from "react";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useAuth } from "@/context/auth/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const auth = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmitPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    router.push("/login");
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
            onSubmit={handleSubmitPassword}
            sx={{ width: "100%", p: { xs: 2, sm: 4 } }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Reset password
            </Typography>
            <Typography color="quaternary" gutterBottom>
              Your previous password has been reseted. Please set a new password
              for your account.
            </Typography>

            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Create Password" //Create Password
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Re-enter Password" //Re-enter Password
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Grid2>
            </Grid2>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, color: "white", padding: 1.5 }}
            >
              Set password
            </Button>

            {/* <Typography textAlign="center" sx={{ mt: 2 }}>
              {"Don't have an account? "}
              <Link href="/register" color="tertiary">
                Sign up
              </Link>
            </Typography> */}
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
