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
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import {
  ChatBubbleOutline,
  MenuBook,
  Add,
  EventNote,
  Close as CloseIcon,
  Edit,
  Settings,
  ReportProblem,
  Logout,
  HowToReg,
  PersonOff,
  RequestQuote,
} from "@mui/icons-material";
import Image from "next/image";
import NotificationTray from "../NotificationTray/NotificationTray";
import { useAuth } from "@/context/auth/auth";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { getCategories, submitReport } from "@/api/report/api";
import { fetchBuddies } from "@/api/buddies/actions";
import { BuddyWithUser } from "@/model/buddy";
import { CategoriesResponse } from "@/api/report/interface";

export interface NavigationBarProps {
  isAdmin?: boolean;
}

export function NavigationBar({ isAdmin = false }: NavigationBarProps) {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("Buddy/Customer Report");
  const [reportText, setReportText] = useState("");
  const [accountName, setAccountName] = useState("");
  const [buddyList, setBuddyList] = useState<BuddyWithUser[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories({
        take: 100,
        skip: 0,
      });

      const categories: CategoriesResponse[] = res.data.data;
      const ReportCategoryMap: Record<string, string> = categories.reduce(
        (map, category) => {
          map[category.name] = category.id;
          return map;
        },
        {} as Record<string, string>,
      );
      setReportCategoryMap(ReportCategoryMap);
    };

    fetchCategories();
  }, []);

  const [reportCategoryMap, setReportCategoryMap] = useState<
    Record<string, string>
  >({});

  const getCategoryId = (categoryName: string): string => {
    return reportCategoryMap[categoryName];
  };

  useEffect(() => {
    const getBuddies = async () => {
      const result = await fetchBuddies();
      if (result.success && result.data) {
        setBuddyList(result.data);
      } else {
        console.error("Error fetching buddies:", result.error);
      }
    };

    getBuddies();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async () => {
    let categoryId;
    let buddy;
    console.log("reportType: ", reportType);
    if (reportType === "Buddy/Customer Report") {
      categoryId = getCategoryId("Buddy Host Complaints");
      console.log("categoryId: ", categoryId);
      buddy = buddyList.find((b) => b.user?.displayName === accountName);
      // console.log("buddy: ", buddy);
      if (buddy?.buddyId === undefined) {
        alert("Buddy not found with the provided account name.");
        // alert(categoryId);
        return;
      }
    } else {
      categoryId = getCategoryId(reportType);
    }
    const data = {
      userId: user?.userId,
      categoryId: categoryId,
      details: reportText,
      buddyId: buddy?.buddyId,
    };
    console.log("data: ", data);
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
        backgroundColor: !isAdmin
          ? theme.palette.background.paper
          : theme.palette.quinary.main,
        color: theme.palette.primary.main,
        px: 2,
        boxShadow: !isAdmin ? theme.shadows[1] : theme.shadows[2],
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          onClick={() => router.push("/")}
        >
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
            {isAdmin && (
              <>
                <Button
                  startIcon={<HowToReg />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/admin/verify")}
                >
                  Admin Verify
                </Button>
                <Button
                  startIcon={<ReportProblem />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/admin/reports")}
                >
                  Reports
                </Button>
                <Button
                  startIcon={<PersonOff />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/admin/suspend")}
                >
                  Suspend Users
                </Button>
              </>
            )}
            {!isAdmin && (
              <>
                {user?.buddy && (
                  <Button
                    startIcon={<RequestQuote />}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                    }}
                    onClick={() => router.push("/booking/history/buddy")}
                  >
                    Requests
                  </Button>
                )}
                <Button
                  startIcon={<MenuBook />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/booking/history")}
                >
                  Bookings
                </Button>
                <Button
                  startIcon={<EventNote />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/booking/schedule")}
                >
                  Calendar
                </Button>
                <Button
                  startIcon={<ChatBubbleOutline />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => router.push("/chat")}
                >
                  Chat
                </Button>
              </>
            )}

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
                onClick={() => router.push("/coin/package")}
              >
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
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    width: 550,
                    mx: "auto",
                    mt: 10,
                    position: "relative",
                    boxShadow: theme.shadows[3],
                  }}
                >
                  {/* Close button at the top-right corner */}
                  <IconButton
                    onClick={() => setReportModalOpen(false)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography variant="h6" id="report-issues-title" mb={2}>
                    Report Issues
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }} color="quaternary">
                    <InputLabel
                      id="report-category-label"
                      sx={{ color: theme.palette.quaternary.main }}
                    >
                      Report Category
                    </InputLabel>
                    <Select
                      labelId="report-category-label"
                      id="report-issues-description"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      label="Report Category"
                      sx={{
                        color: theme.palette.quaternary.main,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.quaternary.main,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.secondary.main,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.quaternary.main,
                        },
                      }}
                    >
                      <MenuItem value="Payment Issues">Payment Issues</MenuItem>
                      <MenuItem value="Buddy/Customer Report">
                        Buddy/Customer Report
                      </MenuItem>
                      <MenuItem value="App/System Issues">
                        App/System Issues
                      </MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>

                  {reportType === "Buddy/Customer Report" && (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Account Name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      color="quaternary"
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: theme.palette.quaternary.main,
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: theme.palette.quaternary.main,
                          },
                          "&:hover fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                          "& input": { color: theme.palette.quaternary.main },
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
                    color="quaternary"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: theme.palette.quaternary.main,
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.secondary.main,
                        },
                      },
                      "& .MuiInputBase-root": {
                        color: theme.palette.quaternary.main,
                      },
                    }}
                  />
                  {/* Submit button */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="tertiary"
                      sx={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        width: "auto",
                      }}
                      onClick={handleSubmit}
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
                color="secondary"
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                  },
                }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                {!user.profilePicture && `${user.firstName.at(0)}`}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                  paper: {
                    sx: {
                      border: `1px solid ${theme.palette.quaternary.main}`,
                      borderRadius: 3,
                      boxShadow: `0px 5px 30px ${theme.palette.quaternary.main}`,
                      mt: 1,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    minWidth: 200,
                  }}
                >
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
                      color="secondary"
                      data-testid="user-avatar"
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
                    color="primary"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      router.push("/profile");
                    }}
                    startIcon={<Edit sx={{ width: 24, height: 24 }} />}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      router.push("/settings");
                    }}
                    startIcon={<Settings fontSize="small" />}
                  >
                    Settings
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    sx={{ justifyContent: "flex-start", mb: 1 }}
                    onClick={() => {
                      setAnchorEl(null);
                      setReportModalOpen(true);
                    }}
                    startIcon={<ReportProblem fontSize="small" />}
                  >
                    Report
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                    startIcon={<Logout fontSize="small" />}
                  >
                    Logout
                  </Button>
                </Box>
              </Menu>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
