"use client";
import { AppBar, Toolbar, Box, Avatar } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material";

export function ReducedNavBar() {
  const theme = useTheme();
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.common.white,
        color: "primary.main",
        px: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* User Avatar */}
          <Avatar
            alt="User"
            data-testid="user-avatar"
            sx={{ bgcolor: "gray" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
