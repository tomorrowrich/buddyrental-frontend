"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid2,
  TextField,
  Checkbox,
  Button,
  Link,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ImageUploadButton from "@/widgets/Signup/ImageUploadButton";
import { initialSignUpData, SignUpFormData } from "@/interface/signup/signup";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { registerUser } from "@/server/signup";

const STORAGE_KEY = "signup-info";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const genders = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "-" },
];

export default function CompleteProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>(initialSignUpData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log(savedData);
    if (savedData) {
      const existingData = JSON.parse(savedData) as SignUpFormData;
      if (
        !existingData.email ||
        !existingData.password ||
        !existingData.firstName ||
        !existingData.lastName
      )
        router.replace("/signup");
      setFormData(() => ({
        ...existingData,
        dateOfBirth: existingData.dateOfBirth
          ? dayjs(existingData.dateOfBirth)
          : null,
      }));
    } else {
      router.replace("/signup");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const newFormData = {
      ...existingData,
      ...formData,
      [name]: newValue,
    };
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const newFormData = {
      ...existingData,
      ...formData,
      dateOfBirth: newValue,
    };

    if (!newValue) return;

    setFormData((prev) => ({
      ...prev,
      dateOfBirth: newValue,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const completeData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    console.log("Complete Profile Data:", completeData);
    const { success, data, error } = await registerUser(completeData);
    if (success) {
      localStorage.removeItem(STORAGE_KEY);
      console.log(data);
      router.push("/signin");
    } else {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid2 container sx={{ p: 2 }}>
        {/* Left half */}
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Complete Your Profile
          </Typography>
          <Typography color="quaternary" gutterBottom sx={{ mb: 4 }}>
            Help us get to know you better with some extra info.
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="nickname"
                label="Nick Name"
                value={formData.nickname}
                onChange={handleInputChange}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                name="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                required
                fullWidth
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="zipcode"
                label="Zip"
                value={formData.zipcode}
                onChange={handleInputChange}
              />
            </Grid2>
          </Grid2>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Checkbox
              {...label}
              sx={{ padding: 0.5 }}
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
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, color: "white", padding: 1.5 }}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            Continue
          </Button>
          <Typography textAlign="center" sx={{ mt: 2 }}>
            {"Already have an account? "}
            <Link href="/signin" color="tertiary">
              Login
            </Link>
          </Typography>
        </Grid2>

        {/* Right half */}
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageUploadButton />
        </Grid2>
      </Grid2>
    </Box>
  );
}
