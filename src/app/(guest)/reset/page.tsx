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
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Grid2,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { LoginCarousel } from "@/widgets/LoginCarousel/LoginCarousel";
import { useRouter, useSearchParams } from "next/navigation";
import { requestPasswordReset, resetPassword } from "@/api/auth/api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const isResetForm = !!token && !!email;

  // Request Password Reset State
  const [requestValues, setRequestValues] = useState({
    email: "",
  });
  const [requestErrors, setRequestErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Reset Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Common State
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  // Password validation
  useEffect(() => {
    if (!isResetForm) return;

    const errors: string[] = [];
    if (password) {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
      }
      if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character");
      }
    }
    setPasswordErrors(errors);
  }, [password, isResetForm]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestValues({ email: event.target.value });
    if (requestErrors.email) {
      setRequestErrors({ email: "" });
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (dialogType === "success") {
      if (isResetForm) {
        router.push("/login");
      } else {
        router.push("/login");
      }
    }
  };

  const handleRequestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!requestValues.email.trim()) {
      setRequestErrors({ email: "Email is required" });
      setLoading(false);
      return;
    }

    if (!isValidEmail(requestValues.email)) {
      setRequestErrors({ email: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    try {
      const response = await requestPasswordReset(requestValues.email);
      console.log(response.data);

      setDialogType("success");
      setDialogTitle("Password Reset Requested");
      setDialogMessage(
        "A password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.",
      );
      setOpenDialog(true);
    } catch (err) {
      console.error(err);
      setDialogType("error");
      setDialogTitle("Error");
      setDialogMessage(
        "We encountered an issue processing your request. Please try again later or contact support if the problem persists.",
      );
      setRequestErrors({
        email: "An error occurred while processing your request.",
      });
      setOpenDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordErrors.length > 0) {
      setFormError("Please fix the password requirements");
      return;
    }

    if (!password) {
      setFormError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (email && token) {
      setLoading(true);
      try {
        // Make API call to reset password using token and password
        const response = await resetPassword(email, token, password);
        console.log(response);

        setFormError("");
        setDialogType("success");
        setDialogTitle("Password Reset Successful");
        setDialogMessage(
          "Your password has been successfully reset. You will now be redirected to the login page.",
        );
        setOpenDialog(true);
      } catch (err) {
        console.error(err);
        setDialogType("error");
        setDialogTitle("Error");
        setDialogMessage(
          "We encountered an issue resetting your password. Please try again or request a new reset link.",
        );
        setFormError("Failed to reset password. Please try again.");
      }
    } else {
      setDialogType("error");
      setDialogTitle("Error");
      setDialogMessage(
        "We encountered an issue resetting your password. Please try again or request a new reset link.",
      );
      setFormError("Failed to reset password. Please try again.");
    }
    setLoading(false);
  };

  const handleBackToRequest = () => {
    router.push("/reset");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        background: (theme) => theme.palette.background.default,
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
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: 3,
              px: 1,
            },
          },
        }}
      >
        <DialogTitle
          id="password-reset-dialog"
          sx={{
            color: dialogType === "success" ? "secondary.main" : "error.main",
            fontWeight: 600,
          }}
        >
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="text.primary">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color={dialogType === "success" ? "secondary" : "primary"}
            variant="contained"
            sx={{ color: "white", mb: 1, mr: 1 }}
          >
            {dialogType === "success" ? "Go to Login" : "Close"}
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
        <Paper
          elevation={2}
          sx={{
            width: { xs: "100%", md: "50%" },
            maxWidth: "100%",
            mx: "auto",
            my: "auto",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {!isResetForm ? (
            // REQUEST PASSWORD RESET FORM
            <Box
              component="form"
              onSubmit={handleRequestSubmit}
              sx={{ width: "100%", p: { xs: 3, sm: 5 } }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Forget your password?
              </Typography>
              <Typography color="quaternary.main" gutterBottom sx={{ mb: 3 }}>
                Don&rsquo;t worry, happens to all of us. Enter your email below
                to recover your password
              </Typography>

              <FormControl
                fullWidth
                margin="normal"
                error={!!requestErrors.email}
                variant="outlined"
              >
                <InputLabel
                  htmlFor="email"
                  sx={{
                    color: requestErrors.email ? "error.main" : "primary.main",
                  }}
                >
                  Email
                </InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={requestValues.email}
                  onChange={handleEmailChange}
                  label="Email"
                  autoFocus
                  autoComplete="email"
                  aria-describedby="email-helper-text"
                  sx={{
                    borderRadius: 2,
                    "&:focus": {
                      borderColor: "secondary.main",
                    },
                  }}
                />
                {requestErrors.email && (
                  <FormHelperText id="email-helper-text" error>
                    {requestErrors.email}
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 4,
                  mb: 2,
                  color: "white",
                  padding: 1.5,
                  fontSize: "1rem",
                  position: "relative",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="tertiary"
                    sx={{ position: "absolute" }}
                  />
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Typography textAlign="center" sx={{ mt: 3 }}>
                {"Remember your password? "}
                <Link href="/login" color="tertiary" sx={{ fontWeight: 600 }}>
                  Log in
                </Link>
              </Typography>

              <Typography textAlign="center" sx={{ mt: 1 }}>
                {"Don't have an account? "}
                <Link
                  href="/register"
                  color="tertiary"
                  sx={{ fontWeight: 600 }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          ) : (
            // RESET PASSWORD FORM
            <Box
              component="form"
              onSubmit={handleResetSubmit}
              sx={{ width: "100%", p: { xs: 3, sm: 5 } }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToRequest}
                sx={{ mb: 2 }}
                color="primary"
              >
                Back
              </Button>

              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                Reset password
              </Typography>
              <Typography color="quaternary.main" gutterBottom sx={{ mb: 3 }}>
                Your previous password has been reset. Please set a new password
                for your account.
              </Typography>

              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}

              <Grid2 container spacing={1} my={4}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Create Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!formError}
                    color="tertiary"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ mb: 1 }}
                  />

                  {password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Password requirements:
                      </Typography>
                      {[
                        "At least 8 characters",
                        "At least one uppercase letter",
                        "At least one lowercase letter",
                        "At least one number",
                        "At least one special character",
                      ].map((requirement, index) => {
                        const isValid = !passwordErrors.some((err) =>
                          err
                            .toLowerCase()
                            .includes(requirement.toLowerCase().substring(8)),
                        );

                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: isValid
                                  ? "secondary.main"
                                  : "grey.300",
                                mr: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                              }}
                            >
                              {isValid && (
                                <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              color={
                                isValid ? "text.primary" : "text.secondary"
                              }
                            >
                              {requirement}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Re-enter Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!formError && password !== confirmPassword}
                    helperText={
                      password !== confirmPassword
                        ? "Passwords do not match"
                        : ""
                    }
                    color="tertiary"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid2>
              </Grid2>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 4,
                  color: "white",
                  padding: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  position: "relative",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="tertiary"
                    sx={{ position: "absolute" }}
                  />
                ) : (
                  "Set Password"
                )}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Carousel Section */}
        <Box
          sx={{
            minHeight: "500px",
            width: { xs: "100%", md: "50%" },
            display: { xs: "none", md: "block" },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <LoginCarousel />
        </Box>
      </Stack>
    </Container>
  );
}
