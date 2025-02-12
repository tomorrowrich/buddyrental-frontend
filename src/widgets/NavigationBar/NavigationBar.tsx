"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
  Menu,
} from "@mui/material";
import {
  NotificationsNone,
  ChatBubbleOutline,
  MenuBook,
  Add,
} from "@mui/icons-material";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { useTheme } from "@mui/material";
// import { useRouter } from "next/navigation";

export interface NavigationBarProps {
  isAdmin?: boolean;
}

export function NavigationBar({ isAdmin = false }: NavigationBarProps) {
  // const router = useRouter();
  const auth = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: !isAdmin ? "white" : theme.palette.quinary.main,
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

            {/* User Avatar with Dialog */}
            <Box>
              <Avatar
                src="https://i.pravatar.cc/40"
                alt="User"
                data-testid="user-avatar"
                sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <Box sx={{ p: 2, minWidth: 200 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar src="https://i.pravatar.cc/40" alt="User" />
                    <Box>
                      <Typography variant="subtitle1">
                        {auth.user?.firstName + " " + auth.user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {auth.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="text"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      // Add navigation to profile page
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      // Add navigation to settings page
                    }}
                  >
                    Settings
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      auth.logout();
                      // router.replace("/signin");
                      setAnchorEl(null);
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Menu>
            </Box>
          </Box>
        )}

        {!auth.isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* User Avatar */}
            <Avatar
              alt="User"
              data-testid="user-avatar"
              sx={{ bgcolor: "gray" }}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
