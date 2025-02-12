"use client";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  Container,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth && auth.isAuthenticated) {
      router.replace("/booking/history");
    }
  }, [auth, router]);

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

  const handleChange =
    (prop: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      // Clear error when user starts typing
      if (errors[prop as keyof typeof errors]) {
        setErrors({ ...errors, [prop]: "" });
      }
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt with:");
    await auth.login({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
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
            maxWidth: "600px",
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
              Login
            </Typography>
            <Typography color="quaternary" gutterBottom>
              Login to access your BuddyRental account
            </Typography>

            <FormControl fullWidth margin="normal" error={!!errors.email}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
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

            <FormControl fullWidth margin="normal" error={!!errors.password}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                aria-describedby="password-helper-text"
              />
              {errors.password && (
                <FormHelperText id="password-helper-text">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                control={<Checkbox color="quinary" />}
                color="primary"
                label="Remember me"
              />
              <Link href="/password-reset" color="tertiary">
                Forgot Password
              </Link>
            </Stack>

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
              <Link href="/signup" color="tertiary">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Carousel Section */}
        <Box
          sx={{
            minHeight: "500px",
            width: { xs: "100%", lg: "50%" },
            display: { xs: "none", lg: "block" },
          }}
        >
          <LoginCarousel />
        </Box>
      </Stack>
    </Container>
  );
}
