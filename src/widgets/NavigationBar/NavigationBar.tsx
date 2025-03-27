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
  FormControlLabel,
  Radio,
  RadioGroup,
  Modal,
  TextField,
} from "@mui/material";

import {
  ChatBubbleOutline,
  MenuBook,
  Add,
  EventNote,
  RequestQuote,
  Close as CloseIcon,
} from "@mui/icons-material";
import Image from "next/image";
import NotificationTray from "../NotificationTray/NotificationTray";
import { useAuth } from "@/context/auth/auth";
import { useState } from "react";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { submitReport } from "@/api/report/api";

export interface NavigationBarProps {
  isAdmin?: boolean;
}

const ReportCategoryMap: Record<string, string> = {
  "Payment Issues": "25d40017-05ad-498b-bfcf-88632cff85d9",
  "Buddy/Customer Report": "123e4567-e89b-12d3-a456-426614174000",
  "App/System Issues": "cebae3c6-4ba6-4747-b351-325eb000243c",
  Others: "6fb1dfaf-d12e-4ce7-a392-f5d83d91a46e",
};

const getCategoryId = (categoryName: string): string => {
  return ReportCategoryMap[categoryName];
};

export function NavigationBar({ isAdmin = false }: NavigationBarProps) {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("Buddy/Customer Report");
  const [reportText, setReportText] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async () => {
    const categoryId = getCategoryId(reportType);
    const data = {
      userId: user?.userId,
      buddyId: accountName || "123e4567-e89b-12d3-a456-426614174000",
      categoryId: categoryId,
      details: reportText,
    };
    try {
      const response = await submitReport(data);
      console.log(response);
    } catch (error) {
      console.error("An error occurred while submitting the report:", error);
    } finally {
      setReportText("");
      setAccountName("");
      setReportType("Payment Issues");
      setReportModalOpen(false);
    }
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

        {/* Right Side - Navigation, Balance, Notifications, Avatar */}
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {user.buddy?.buddyId && (
              <Button
                startIcon={<RequestQuote />}
                sx={{ color: "primary.main", textTransform: "none" }}
                onClick={() => router.push("/app/booking/history/buddy")}
              >
                Requests
              </Button>
            )}
            <Button
              startIcon={<MenuBook />}
              sx={{ color: "primary.main", textTransform: "none" }}
              onClick={() => router.push("/app/booking/history")}
            >
              Bookings
            </Button>
            <Button
              startIcon={<EventNote />}
              sx={{ color: "primary.main", textTransform: "none" }}
              onClick={() => router.push("/app/booking/schedule")}
            >
              Calendar
            </Button>
            <Button
              startIcon={<ChatBubbleOutline />}
              sx={{ color: "primary.main", textTransform: "none" }}
              onClick={() => router.push("/app/chat")}
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
            <NotificationTray userId={user.userId} />

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
                    width: 550,
                    mx: "auto",
                    mt: 10,
                    position: "relative",
                  }}
                >
                  {/* Close button at the top-right corner */}
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
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <FormControlLabel
                        value="Payment Issues"
                        control={
                          <Radio
                            sx={{
                              color: "#EDA4BD",
                              "&.Mui-checked": { color: "#EDA4BD" },
                            }}
                          />
                        }
                        label="Payment Issues"
                      />
                      <FormControlLabel
                        value="Buddy/Customer Report"
                        control={
                          <Radio
                            sx={{
                              color: "#EDA4BD",
                              "&.Mui-checked": { color: "#EDA4BD" },
                            }}
                          />
                        }
                        label="Buddy/Customer Report"
                      />
                      <FormControlLabel
                        value="App/System Issues"
                        control={
                          <Radio
                            sx={{
                              color: "#EDA4BD",
                              "&.Mui-checked": { color: "#EDA4BD" },
                            }}
                          />
                        }
                        label="App/System Issues"
                      />
                      <FormControlLabel
                        value="Others"
                        control={
                          <Radio
                            sx={{
                              color: "#EDA4BD",
                              "&.Mui-checked": { color: "#EDA4BD" },
                            }}
                          />
                        }
                        label="Others"
                      />
                    </Box>
                  </RadioGroup>
                  {reportType === "Buddy/Customer Report" && (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Account Name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      sx={{
                        "& .MuiInputLabel-root": { color: "#EDA4BD" }, // สีของ label
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#EDA4BD" }, // สีเส้นขอบปกติ
                          "&:hover fieldset": { borderColor: "#D16BA5" }, // สีเส้นขอบเมื่อ hover
                          "& input": { color: "#EDA4BD" }, // สีตัวอักษรในช่อง input
                        },
                      }}
                    />
                  )}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    placeholder="Please give more details about the problem"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#EDA4BD" },
                        "&:hover fieldset": { borderColor: "#D16BA5" },
                      },
                      "& .MuiInputBase-root": { color: "#EDA4BD" },
                    }}
                  />
                  {/* Submit button */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#EB7BC0",
                        color: "white",
                        "&:hover": { backgroundColor: "#D16BA5" },
                        padding: "8px 16px",
                        fontSize: "14px",
                        width: "auto",
                      }}
                      onClick={handleSubmit} // แก้ให้เมื่อกดปุ่มแล้วทำการ Report ด้วย
                    >
                      Report
                    </Button>
                  </Box>
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
                    <Avatar
                      src={
                        user.profilePicture ? user.profilePicture : undefined
                      }
                      alt="User"
                    >
                      {!user.profilePicture && `${user.firstName.at(0)}`}
                    </Avatar>
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
