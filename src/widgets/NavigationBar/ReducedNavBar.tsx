"use client";
import { AppBar, Toolbar, Box, Button } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export function ReducedNavBar() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: "primary.main",
        px: 2,
        boxShadow: theme.shadows[1],
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 0,
        }}
      >
        {/* Left Side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image
            src="/logo-full.svg"
            alt="BuddyRental Logo"
            width={200}
            height={40}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Login/Register Buttons */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/login")}
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="tertiary"
            onClick={() => router.push("/register")}
            sx={{ textTransform: "none" }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
