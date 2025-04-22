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
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  NotificationsNone,
  ChatBubbleOutline,
  Close as CloseIcon,
  Add,
} from "@mui/icons-material";
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
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("Payment Issues");
  const [reportText, setReportText] = useState("");
  const [accountName, setAccountName] = useState("");

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
        {/* Left Side - Menu */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
        >
          <IconButton
            aria-label="menu"
            sx={{ color: "primary.main" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
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
                <Divider />
                <ListItem key={"Content 2"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ChatBubbleOutline />
                    </ListItemIcon>
                    <ListItemText primary={"Content 2"} />
                  </ListItemButton>
                </ListItem>
                <Divider />
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

        {/* Middle Box (Centered) */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/logo.svg"
            alt="BuddyRental Logo"
            width={40}
            height={40}
          />
        </Box>

        {/* Right Side - Navigation, Balance, Notifications, Avatar */}
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Balance */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.quinary.main,
                borderRadius: "20px",
                padding: "5px 10px",
                gap: 1,
              }}
            >
              <Typography color="secondary" fontWeight="bold">
                {user.balance}
              </Typography>
              <IconButton
                size="small"
                sx={{ color: theme.palette.tertiary.main }}
                onClick={() => router.push("/app/coin/package")}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>

            {/* Notifications */}
            <IconButton>
              <NotificationsNone sx={{ color: "primary.main" }} />
            </IconButton>

            {/* User Avatar with Dialog */}
            <Box>
              {/* Report Issues Modal */}
              <Modal
                open={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                aria-labelledby="report-issues-title"
                aria-describedby="report-issues-description"
              >
                <Box
                  sx={{
                    p: 4,
                    backgroundColor: "white",
                    borderRadius: 2,
                    width: 300,
                    mx: "auto",
                    mt: 10,
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  <IconButton
                    onClick={() => setReportModalOpen(false)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#C46BAE",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" id="report-issues-title" mb={2}>
                    Report Issues
                  </Typography>
                  <RadioGroup
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    id="report-issues-description"
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 2,
                      }}
                    >
                      <FormControlLabel
                        value="Payment Issues"
                        control={<Radio sx={{ color: "#EDA4BD" }} />}
                        label="Payment Issues"
                      />
                      <FormControlLabel
                        value="Buddy/Customer Report"
                        control={<Radio sx={{ color: "#EDA4BD" }} />}
                        label="Buddy/Customer Report"
                      />
                      <FormControlLabel
                        value="App/System Issues"
                        control={<Radio sx={{ color: "#EDA4BD" }} />}
                        label="App/System Issues"
                      />
                      <FormControlLabel
                        value="Others"
                        control={<Radio sx={{ color: "#EDA4BD" }} />}
                        label="Others"
                      />
                    </Box>
                  </RadioGroup>

                  {reportType === "Buddy/Customer Report" && (
                    <TextField
                      label="Account Name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      fullWidth
                      margin="normal"
                      sx={{
                        "& .MuiInputLabel-root": { color: "#EDA4BD" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#EDA4BD" },
                          "&:hover fieldset": { borderColor: "#D16BA5" },
                        },
                        "& input": { color: "#EDA4BD" },
                      }}
                    />
                  )}

                  <TextField
                    label="Details"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    sx={{
                      "& .MuiInputLabel-root": { color: "#EDA4BD" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#EDA4BD" },
                        "&:hover fieldset": { borderColor: "#D16BA5" },
                      },
                      "& textarea": { color: "#EDA4BD" },
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: "#C46BAE",
                      "&:hover": { backgroundColor: "#AB5493" },
                      fontSize: "0.875rem",
                      padding: "6px 16px",
                      display: "block",
                      mx: "auto",
                    }}
                    onClick={() => {
                      console.log("Report Submitted", {
                        reportType,
                        reportText,
                        accountName,
                      });
                      setReportModalOpen(false); // แก้ให้เมื่อกดปุ่มแล้วทำการ Report ด้วย
                    }}
                  >
                    Report
                  </Button>
                </Box>
              </Modal>

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
                      router.push("/profile");
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
                    variant="text"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      setReportModalOpen(true);
                    }}
                  >
                    Report
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
