"use client";

import {
  Container,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Modal,
  Divider,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState, useEffect } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { getPersonalSchedule } from "@/api/schedule/api";

type PersonalScheduleData = {
  reservations: Array<{
    start: string;
    end: string;
    description: string;
    status: "BUSY" | "UNCONFIRMED";
  }>;
  busy: number[];
  unconfirmed: number[];
};

export default function Schedule() {
  const [schedules, setSchedules] = useState<PersonalScheduleData | undefined>(
    undefined,
  );
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [showDaySchedule, setShowDaySchedule] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      const startOfMonth = currentMonth.startOf("month").toDate();
      const endOfMonth = currentMonth.endOf("month").toDate();

      try {
        const scheduleData = await getPersonalSchedule({
          start: startOfMonth,
          end: endOfMonth,
        });
        setSchedules(scheduleData.data);
      } catch (error) {
        console.error("Failed to fetch buddy schedule:", error);
      }
    };

    fetchScheduleData();
  }, [currentMonth]);

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
        onClick={() => {
          setSelectedDate(day);
          setShowDaySchedule(true);
        }}
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
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      />
    );
  };

  // Handle month change in calendar
  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  // Get reservations for the selected date
  const getReservationsForSelectedDate = () => {
    if (!schedules || !schedules.reservations) return [];

    const selectedDateStr = selectedDate.format("YYYY-MM-DD");
    return schedules.reservations.filter((res) => {
      const startDate = dayjs(res.start).format("YYYY-MM-DD");
      return startDate === selectedDateStr;
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 5,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          boxShadow: "0 6px 20px rgba(124, 96, 107, 0.12)",
          border: "1px solid rgba(124, 96, 107, 0.15)",
          p: 3,
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonthIcon sx={{ mr: 1 }} />
            Your Calendar
          </Box>
        </Typography>

        <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
          <Chip
            label="Busy"
            size="small"
            sx={{ bgcolor: "#f0f0f0", color: "#999" }}
          />
          <Chip
            label="Pending Confirmation"
            size="small"
            variant="outlined"
            sx={{ border: "1px dashed #EB7BC0" }}
          />
          <Chip
            label="Today"
            size="small"
            sx={{ bgcolor: "primary.main", color: "white" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DateCalendar
            minDate={dayjs().subtract(6, "month")}
            shouldDisableYear={(year) =>
              dayjs(year.toString()).isAfter(dayjs().add(6, "month"))
            }
            maxDate={dayjs().add(6, "month")}
            value={dayjs()} // Always show today as selected
            onChange={(newDate) => {
              if (newDate) {
                setSelectedDate(newDate);
                setShowDaySchedule(true);
              }
            }}
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
              width: "100%",
              height: "100%",
              maxHeight: "none",
              "&.MuiDateCalendar-root": {
                maxHeight: "none",
                "& .MuiDayCalendar-weekDayLabel": {
                  fontSize: "1rem",
                },
                '& div[role="row"]': {
                  justifyContent: "space-around",
                },
                "& .MuiDayCalendar-slideTransition": {
                  minHeight: "500px",
                },
                "& .MuiPickersDay-root": {
                  height: "50px",
                  width: "50px",
                  fontSize: "1rem",
                },
              },
              "& .MuiPickersCalendarHeader-root": {
                marginTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                "& .MuiPickersCalendarHeader-label": {
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "primary.dark",
                  transition: "0.3s",
                  "&:hover": {
                    color: "primary.main",
                  },
                },
                "& .MuiPickersArrowSwitcher-root": {
                  "& .MuiButtonBase-root": {
                    color: "primary.main",
                    backgroundColor: "rgba(235, 123, 192, 0.1)",
                    borderRadius: "50%",
                    padding: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(235, 123, 192, 0.2)",
                      transform: "scale(1.1)",
                    },
                  },
                  "& .Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.26)",
                    backgroundColor: "transparent",
                  },
                },
              },
              "& .MuiPickersCalendarHeader-switchViewButton": {
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(235, 123, 192, 0.1)",
                },
              },
              "& .MuiYearCalendar-root": {
                "& .MuiPickersYear-yearButton": {
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  margin: "4px",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(235, 123, 192, 0.1)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                },
              },
              "& .MuiDayCalendar-header": {
                justifyContent: "space-around",
              },
              "& .MuiDayCalendar-weekContainer": {
                justifyContent: "space-around",
                margin: "8px 0",
              },
            }}
          />
        </Box>

        {/* Day Schedule Modal */}
        <Modal
          open={showDaySchedule}
          onClose={() => setShowDaySchedule(false)}
          aria-labelledby="day-schedule-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Schedule for {selectedDate.format("MMMM D, YYYY")}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowDaySchedule(false)}
              >
                Close
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {getReservationsForSelectedDate().length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Your appointments for today:
                </Typography>
                {getReservationsForSelectedDate().map((reservation, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor:
                        reservation.status === "BUSY" ? "#e0e0e0" : "#EB7BC0",
                      borderStyle:
                        reservation.status === "UNCONFIRMED"
                          ? "dashed"
                          : "solid",
                      bgcolor:
                        reservation.status === "BUSY"
                          ? "#f8f8f8"
                          : "rgba(235, 123, 192, 0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight="bold">
                        {dayjs(reservation.start).format("h:mm A")} -{" "}
                        {dayjs(reservation.end).format("h:mm A")}
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          reservation.status === "BUSY"
                            ? "Busy"
                            : "Pending Confirmation"
                        }
                        sx={{
                          bgcolor:
                            reservation.status === "BUSY"
                              ? "#f0f0f0"
                              : "transparent",
                          color:
                            reservation.status === "BUSY" ? "#666" : "#EB7BC0",
                          border:
                            reservation.status === "UNCONFIRMED"
                              ? "1px dashed #EB7BC0"
                              : "none",
                        }}
                      />
                    </Box>
                    <Typography>{reservation.description}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No appointments scheduled for this day.
              </Typography>
            )}
          </Box>
        </Modal>
      </Paper>
    </Container>
  );
}
