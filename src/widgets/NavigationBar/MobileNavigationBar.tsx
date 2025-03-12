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
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NotificationsNone, ChatBubbleOutline } from "@mui/icons-material";
import Image from "next/image";
import { useAuth } from "@/context/auth/auth";
import { useState } from "react";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export interface MobileNavigationBarProps {
  isAdmin?: boolean;
}

export function MobileNavigationBar({
  isAdmin = false,
}: MobileNavigationBarProps) {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerState, setDrawerState] = useState<boolean>(false);

  const handleLogout = async () => {
    console.log("Logging out");
    await logout();
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerState(open);
    };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: !isAdmin ? "white" : theme.palette.quinary.main,
        color: "primary.main",
        px: 2,
        boxShadow: `0px 2px 4px ${!isAdmin ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0.1)"}`,
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

          <IconButton
            sx={{ color: "primary.main" }}
            onClick={toggleDrawer(true)}
          />
          <Drawer
            anchor={"top"}
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            {/*List Object Here */}
            <Box
              sx={{ width: "auto" }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                <ListItem key={"Content 1"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ChatBubbleOutline />
                    </ListItemIcon>
                    <ListItemText primary={"Content 1"} />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem key={"Content 2"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ChatBubbleOutline />
                    </ListItemIcon>
                    <ListItemText primary={"Content 2"} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"Content 3"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ChatBubbleOutline />
                    </ListItemIcon>
                    <ListItemText primary={"Content 3"} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Box>

        {/* Right Side - Notifications, Avatar */}
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Notifications */}
            <IconButton>
              <NotificationsNone sx={{ color: "primary.main" }} />
            </IconButton>

            {/* User Avatar with Dialog */}
            <Box>
              <Avatar
                src={user.profilePicture ? user.profilePicture : undefined}
                alt="User"
                data-testid="user-avatar"
                sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                {!user.profilePicture && `${user.firstName.at(0)}`}
              </Avatar>
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
                        {user.firstName + " " + user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="text"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      router.push("/app/profile");
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
                      router.push("/settings");
                    }}
                  >
                    Settings
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Menu>
            </Box>
          </Box>
        )}

        {!user && (
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
