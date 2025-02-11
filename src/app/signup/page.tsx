"use client";
import {
  Box,
  Typography,
  Grid2,
  TextField,
  Checkbox,
  Button,
  Link,
} from "@mui/material";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Signup({
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

          {/* text box */}
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField required id="outlined-required" label="First name" />
              <TextField required id="outlined-required" label="Last name" />
            </div>
          </Box>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Identity card Number"
              />
            </div>
          </Box>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField required id="outlined-required" label="Email" />
              <TextField required id="outlined-required" label="Phone Number" />
            </div>
          </Box>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Password"
                type="password"
              />
            </div>
          </Box>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "62ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Confirm Password"
                type="password"
              />
            </div>
          </Box>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox {...label} />
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
          <Typography textAlign="center" sx={{ mt: 2 }}>
            {"Already have an account? "}
            <Link href="/signin" color="tertiary">
              Login
            </Link>
          </Typography>
        </Grid2>

        {/* Right half */}
        <Grid2
          item
          size={6}
          sx={{
            backgroundColor: "#FFDAB9",
            width: { xs: "100%", md: "50%" },
            minHeight: "500px",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            ? help
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
}
