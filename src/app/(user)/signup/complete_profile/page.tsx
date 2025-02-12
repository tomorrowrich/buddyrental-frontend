"use client";
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
//import dayjs from "dayjs";
//import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
//import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
//import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "none", label: "-" },
];

export default function complete_profile({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
            justifyContent: "flex-start",
            alignContent: "flex-start",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Complete Your Profile
          </Typography>
          <Typography color="#ffffff00" gutterBottom>
            empty
          </Typography>
          <Typography color="quaternary" gutterBottom>
            Help us get to know you better with some extra info.
          </Typography>
          <Typography color="#ffffff00" gutterBottom>
            empty
          </Typography>

          {/* text box */}
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextField
                required
                sx={{ flex: 1 }}
                id="nick-name"
                label="Nick Name"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker sx={{ flex: 1 }} label="Date of Birth" />
              </LocalizationProvider>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "100%",
                  mt: 2,
                }}
              >
                <TextField
                  id="gender"
                  select
                  label="Gender"
                  defaultValue="none"
                  helperText="Select your gender"
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  sx={{ flex: 1 }}
                  id="phone"
                  label="Phone Number"
                />
              </Box>
            </Box>
            <Box sx={{ width: "100%", mt: 2 }}>
              <TextField required fullWidth id="address" label="Address" />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                mt: 2,
              }}
            >
              <TextField required sx={{ flex: 1 }} id="city" label="City" />
              <TextField required sx={{ flex: 1 }} id="zip" label="Zip" />
            </Box>
          </Box>

          <Box
            sx={{ width: "100%", display: "flex", alignItems: "center", mt: 1 }}
          >
            <Checkbox {...label} sx={{ padding: 0.5 }} />
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
            component={Link}
            href="/verify"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, color: "white", padding: 1.5 }}
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
          size={6}
          sx={{
            width: { xs: "100%", md: "100%" },
            minHeight: "500px",
            maxWidth: "600px",
          }}
        >
          <ImageUploadButton />
        </Grid2>
      </Grid2>
    </Box>
  );
}
