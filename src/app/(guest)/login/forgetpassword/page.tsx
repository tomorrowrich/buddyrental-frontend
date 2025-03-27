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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, FormEvent } from "react";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/api/auth/api";

export default function PasswordResetPage() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ email: event.target.value });
    if (errors.email) {
      setErrors({ email: "" });
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push("/login");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(values.email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await requestPasswordReset(values.email);
      console.log(response);

      if (response.success) {
        setOpenDialog(true);
      }
    } catch (error) {
      setErrors({ email: "An error occurred while processing your request." });
      setOpenDialog(true);
    }
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="password-reset-dialog"
      >
        <DialogTitle id="password-reset-dialog">
          Password Reset Requested
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            A password reset link has been sent to your email. Please check your
            inbox and follow the instructions to reset your password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

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
