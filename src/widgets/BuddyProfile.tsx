"use client";

import {
  Container,
  Paper,
  Box,
  Typography,
  Grid2,
  Card,
  Avatar,
  Tooltip,
  Rating,
  Stack,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState, useEffect } from "react";
import { BookingDialog } from "./Booking/BookingDialog";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import { BuddyWithUser } from "@/model/buddy";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { getBuddySchedule } from "@/api/schedule/api";
import { createChat } from "@/api/chat/api";
import { useRouter } from "next/navigation";

type BuddyScheduleData = {
  busy: number[];
  unconfirmed: number[];
};

export function BuddyProfile({ buddy }: { buddy: BuddyWithUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [schedules, setSchedules] = useState<BuddyScheduleData | undefined>(
    undefined,
  );
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [chatId, setChatId] = useState<string>("");

  const fullName =
    buddy.user?.firstName && buddy.user?.lastName
      ? `${buddy.user.firstName} ${buddy.user.lastName}`
      : "Buddy Profile";

  const chat = async () => {
    const chat = await createChat(buddy.buddyId);
    if (chat.success) {
      setChatId(chat.chatId!);
    } else {
      console.error("Failed to create chat:", chat.error);
    }
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      const startOfMonth = currentMonth.startOf("month").toDate();
      const endOfMonth = currentMonth.endOf("month").toDate();

      try {
        const scheduleData = await getBuddySchedule(buddy.buddyId, {
          start: startOfMonth,
          end: endOfMonth,
        });

        setSchedules(scheduleData.data);
      } catch (error) {
        console.error("Failed to fetch buddy schedule:", error);
      }
    };

    fetchScheduleData();
  }, [buddy.buddyId, currentMonth]);

  // Custom day renderer for the calendar
  const ServerDay = (
    props: PickersDayProps<Dayjs> & {
      busyDays?: number[];
      unconfirmedDays?: number[];
    },
  ) => {
    const { busyDays = [], unconfirmedDays = [], day, ...other } = props;
    const dayOfMonth = day.date();

    // Check if the day is busy
    const isBusy = busyDays.includes(dayOfMonth);

    // Check if the day is unconfirmed
    const isUnconfirmed = unconfirmedDays.includes(dayOfMonth);

    // Apply styles based on day status
    return (
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(isBusy && {
            backgroundColor: "#f0f0f0",
            color: "#999",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }),
          ...(isUnconfirmed && {
            border: "1px dashed #EB7BC0",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(235, 123, 192, 0.1)",
            },
          }),
          ...(dayjs().date() === dayOfMonth &&
            dayjs().month() === day.month() && {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }),
        }}
      />
    );
  };

  // Handle month change in calendar
  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <BookingDialog
        buddyId={buddy.buddyId}
        buddyName={fullName}
        open={open}
        setOpen={setOpen}
        onSendMessage={console.log}
      />
      <Paper
        elevation={0}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(124, 96, 107, 0.12)",
          border: "1px solid rgba(124, 96, 107, 0.15)",
        }}
      >
        {/* Header Banner */}
        <Box
          sx={{
            height: "80px",
            p: 3,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(124, 96, 107, 0.15)",
          }}
        >
          <Typography variant="h4" fontWeight={700} color="primary">
            Buddy Profile
          </Typography>
        </Box>

        <Grid2 container spacing={3} sx={{ p: 3 }}>
          {/* Left Column - Profile */}
          <Grid2 size={{ xs: 12, md: 5, lg: 4 }}>
            <Card
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                overflow: "visible",
                position: "relative",
                background: "#ffffff",
                boxShadow: "0 8px 20px rgba(124, 96, 107, 0.15)",
              }}
            >
              <Avatar
                src={buddy.user?.profilePicture || ""}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Box
                sx={{
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ mr: 1 }}>
                  {fullName}
                </Typography>
                {buddy.user?.verified && (
                  <Tooltip title="Verified Buddy">
                    <VerifiedIcon color="primary" />
                  </Tooltip>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                <Rating
                  value={buddy.ratingAvg || 0}
                  readOnly
                  precision={0.5}
                  icon={
                    <StarRoundedIcon
                      fontSize="small"
                      sx={{ color: "#EB7BC0" }}
                    />
                  }
                  emptyIcon={
                    <StarRoundedIcon
                      fontSize="small"
                      sx={{ color: "#E0E0E0" }}
                    />
                  }
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({buddy.totalReviews || 0} reviews)
                </Typography>
              </Box>

              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  color: "text.secondary",
                }}
              >
                <LocationOnIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: "secondary.main" }}
                />
                {buddy.user?.city || "Location not specified"}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  {buddy.description || "No description provided"}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                {buddy.user?.interests && buddy.user.interests.length > 0 ? (
                  buddy.user.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest.name}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No interests listed
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Chip
                label={`Price range: ${buddy.priceMin || 0} - ${buddy.priceMax || "Flexible"}`}
                color="secondary"
                sx={{
                  mb: 2,
                }}
              />

              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ChatIcon />}
                  onClick={() => {
                    createChat(buddy.buddyId).then((chat) => {
                      console.log(chat);
                      if (chat.success) {
                        router.push(`/chat?chat=${chat.chatId}`);
                      } else {
                        console.error("Failed to create chat:", chat.error);
                      }
                    });
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    boxShadow: "0 3px 8px rgba(196, 107, 174, 0.2)",
                  }}
                >
                  Chat
                </Button>
                <Button
                  variant="contained"
                  color="tertiary"
                  onClick={() => setOpen(true)}
                  startIcon={<CalendarMonthIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    color: "white",
                    boxShadow: "0 3px 8px rgba(124, 96, 107, 0.2)",
                  }}
                >
                  Book
                </Button>
              </Stack>
            </Card>
          </Grid2>

          {/* Right Column - Calendar and Reviews */}
          <Grid2 size={{ xs: 12, md: 7, lg: 8 }}>
            <Stack spacing={3}>
              {/* Availability Calendar */}
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  boxShadow: "0 6px 16px rgba(124, 96, 107, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.dark"
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: "1px solid",
                    borderColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  Check {buddy.user?.firstName || "Buddy"}&apos;s Availability
                </Typography>

                <Box sx={{ mb: 1 }}>
                  <Chip
                    label="Busy"
                    size="small"
                    sx={{ mr: 1, bgcolor: "#f0f0f0", color: "#999" }}
                  />
                  <Chip
                    label="Pending Confirmation"
                    size="small"
                    variant="outlined"
                    sx={{ border: "1px dashed #EB7BC0" }}
                  />
                </Box>

                <DateCalendar
                  disablePast={true}
                  shouldDisableYear={(year) =>
                    dayjs(year.toString()).isAfter(dayjs().add(6, "month"))
                  }
                  maxDate={dayjs().add(6, "month")}
                  readOnly={true}
                  onMonthChange={handleMonthChange}
                  slots={{
                    day: (props) => (
                      <ServerDay
                        {...props}
                        busyDays={schedules?.busy || []}
                        unconfirmedDays={schedules?.unconfirmed || []}
                      />
                    ),
                  }}
                  sx={{
                    mx: "auto",
                    "& .MuiPickersDay-root": {
                      borderRadius: "50%",
                      pointerEvents: "none",
                    },
                  }}
                />
              </Card>

              {/* Reviews Section */}
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  boxShadow: "0 6px 16px rgba(124, 96, 107, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.dark"
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: "1px solid",
                    borderColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarRoundedIcon sx={{ mr: 1 }} />
                  Customer Reviews
                </Typography>

                {buddy.reviews && buddy.reviews.length > 0 ? (
                  buddy.reviews.map((review, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        p: 2,
                        mt: 2,
                        borderRadius: 2,
                        background: "#fafafa",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(124, 96, 107, 0.08)",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Avatar
                          src={buddy.user!.profilePicture}
                          sx={{
                            width: 40,
                            height: 40,
                            border: "1px solid #f0f0f0",
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {"Reviewer name"}
                          </Typography>
                          <Rating
                            value={buddy.ratingAvg}
                            readOnly
                            size="small"
                            icon={
                              <StarRoundedIcon
                                fontSize="inherit"
                                sx={{ color: "#EB7BC0" }}
                              />
                            }
                            emptyIcon={
                              <StarRoundedIcon
                                fontSize="inherit"
                                sx={{ color: "#E0E0E0" }}
                              />
                            }
                            sx={{ my: 0.5 }}
                          />
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {"SOME comment"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Posted on {new Date().toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: "#f9f9f9",
                      border: "1px dashed #ddd",
                    }}
                  >
                    <Typography color="text.secondary">
                      No reviews yet. Be the first to leave a review!
                    </Typography>
                  </Paper>
                )}
              </Card>
            </Stack>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
}
