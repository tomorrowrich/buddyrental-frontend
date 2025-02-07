"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import {
  NotificationsNone,
  ChatBubbleOutline,
  MenuBook,
  Add,
} from "@mui/icons-material";
import Image from "next/image";
import { useAuth } from "@/context/auth";

export function NavigationBar() {
  const auth = useAuth();
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "white", color: "primary.main", px: 2 }}
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

        {/* Right Side - Navigation, Balance, Notifications, Avatar */}
        {auth.isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Button
              startIcon={<MenuBook />}
              sx={{ color: "primary.main", textTransform: "none" }}
            >
              Bookings
            </Button>
            <Button
              startIcon={<ChatBubbleOutline />}
              sx={{ color: "primary.main", textTransform: "none" }}
            >
              Chat
            </Button>

            {/* Balance */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "quinary.main",
                borderRadius: "20px",
                padding: "5px 10px",
                gap: 1,
              }}
            >
              <Typography color="secondary" fontWeight="bold">
                123.00
              </Typography>
              <IconButton size="small" sx={{ color: "tertiary.main" }}>
                <Add fontSize="small" />
              </IconButton>
            </Box>

            {/* Notifications */}
            <IconButton>
              <NotificationsNone sx={{ color: "primary.main" }} />
            </IconButton>

            {/* User Avatar */}
            <Avatar
              src="https://i.pravatar.cc/40"
              alt="User"
              sx={{ bgcolor: "secondary.main" }}
            />
          </Box>
        )}

        {!auth.isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* User Avatar */}
            <Avatar alt="User" sx={{ bgcolor: "gray" }} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
