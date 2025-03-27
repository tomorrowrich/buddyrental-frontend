"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Divider,
  Button,
  Avatar,
  Stack,
} from "@mui/material";

const SuspendData = ({
  data,
}: {
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    mockTime: number;
  }[];
}) => {
  const theme = useTheme();

  // Track suspended status and countdown
  const [suspendedUsers, setSuspendedUsers] = useState<
    { id: number; timer: number }[]
  >([]);

  const handleButtonClick = (id: number) => {
    setSuspendedUsers((prev) => {
      const isSuspended = prev.some((user) => user.id === id);
      if (isSuspended) {
        // Undo suspension
        return prev.filter((user) => user.id !== id);
      } else {
        // Suspend user with mock time
        const user = data.find((u) => u.id === id);
        return [...prev, { id, timer: user?.mockTime || 0 }];
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSuspendedUsers((prev) => {
        const updatedUsers = prev
          .map((user) => {
            if (user.timer > 0) {
              return { ...user, timer: user.timer - 1 };
            }
            return user;
          })
          .filter((user) => user.timer > 0); // Remove users with expired timers
        return updatedUsers;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "ban";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    if (months > 0 && remainingDays > 0) {
      return `${months} month${months > 1 ? "s" : ""} ${remainingDays} day${remainingDays > 1 ? "s" : ""} left`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} left`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} left`;
    }
  };

  return (
    <Box mt={2}>
      {data.map((account) => {
        const user = suspendedUsers.find((user) => user.id === account.id);
        const isSuspended = !!user;
        const timerText = isSuspended ? formatTime(user?.timer || 0) : "";

        return (
          <Box key={account.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={account.avatar} alt={account.name} />
                <Box>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {account.name}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {account.email}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ marginRight: 2, color: "red" }}
                >
                  {timerText}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: isSuspended ? "white" : undefined,
                    color: isSuspended ? "red" : undefined,
                    border: isSuspended ? "2px solid red" : undefined,
                  }}
                  onClick={() => handleButtonClick(account.id)} // Handle button click
                  disabled={user?.timer === 0} // Disable button if the user is banned
                >
                  {isSuspended ? "Undo suspend" : "Suspend"}{" "}
                  {/* Toggle button text */}
                </Button>
              </Box>
            </Box>

            <Divider
              sx={{ background: theme.palette.quinary.main }}
              variant="middle"
            />
          </Box>
        );
      })}
    </Box>
  );
};

// Main Page Component
export default function SuspendAccount() {
  const theme = useTheme();

  // Complete suspended data with mockTime in seconds (mock times)
  const suspendData = [
    {
      id: 1,
      name: "Alexa Rawles",
      email: "alexarawles@gmail.com",
      avatar: "https://picsum.photos/200?random=1",
      mockTime: 5 * 24 * 60 * 60,
    }, // 5 days
    {
      id: 2,
      name: "John Smith",
      email: "johnsmith@gmail.com",
      avatar: "https://picsum.photos/200?random=2",
      mockTime: 10 * 24 * 60 * 60,
    }, // 10 days
    {
      id: 3,
      name: "Emma Wilson",
      email: "emmaw@gmail.com",
      avatar: "https://picsum.photos/200?random=3",
      mockTime: 2 * 30 * 24 * 60 * 60,
    }, // 2 months
    {
      id: 4,
      name: "Michael Chen",
      email: "mchen@gmail.com",
      avatar: "https://picsum.photos/200?random=4",
      mockTime: 0,
    }, // Ban immediately
    {
      id: 5,
      name: "Sarah Johnson",
      email: "sarahj@gmail.com",
      avatar: "https://picsum.photos/200?random=5",
      mockTime: 15 * 24 * 60 * 60,
    }, // 15 days
    {
      id: 6,
      name: "David Brown",
      email: "dbrown@gmail.com",
      avatar: "https://picsum.photos/200?random=6",
      mockTime: 0,
    }, // Ban immediately
    {
      id: 7,
      name: "Lisa Anderson",
      email: "landerson@gmail.com",
      avatar: "https://picsum.photos/200?random=7",
      mockTime: 7 * 24 * 60 * 60,
    }, // 7 days
    {
      id: 8,
      name: "James Wilson",
      email: "jwilson@gmail.com",
      avatar: "https://picsum.photos/200?random=8",
      mockTime: 3 * 30 * 24 * 60 * 60,
    }, // 3 months
    {
      id: 9,
      name: "Maria Garcia",
      email: "mgarcia@gmail.com",
      avatar: "https://picsum.photos/200?random=9",
      mockTime: 1 * 30 * 24 * 60 * 60,
    }, // 1 month
    {
      id: 10,
      name: "Robert Taylor",
      email: "rtaylor@gmail.com",
      avatar: "https://picsum.photos/200?random=10",
      mockTime: 2 * 24 * 60 * 60,
    }, // 2 days
    {
      id: 11,
      name: "Patricia Lee",
      email: "plee@gmail.com",
      avatar: "https://picsum.photos/200?random=11",
      mockTime: 3 * 24 * 60 * 60,
    }, // 3 days
    {
      id: 12,
      name: "Thomas Martin",
      email: "tmartin@gmail.com",
      avatar: "https://picsum.photos/200?random=12",
      mockTime: 0,
    }, // Ban immediately
    {
      id: 13,
      name: "Sandra White",
      email: "swhite@gmail.com",
      avatar: "https://picsum.photos/200?random=13",
      mockTime: 10 * 24 * 60 * 60,
    }, // 10 days
    {
      id: 14,
      name: "Kevin Moore",
      email: "kmoore@gmail.com",
      avatar: "https://picsum.photos/200?random=14",
      mockTime: 1 * 30 * 24 * 60 * 60,
    }, // 1 month
    {
      id: 15,
      name: "Nancy Davis",
      email: "ndavis@gmail.com",
      avatar: "https://picsum.photos/200?random=15",
      mockTime: 8 * 24 * 60 * 60,
    }, // 8 days
    {
      id: 16,
      name: "Daniel Miller",
      email: "dmiller@gmail.com",
      avatar: "https://picsum.photos/200?random=16",
      mockTime: 20 * 24 * 60 * 60,
    }, // 20 days
    {
      id: 17,
      name: "Elizabeth Clark",
      email: "eclark@gmail.com",
      avatar: "https://picsum.photos/200?random=17",
      mockTime: 0,
    }, // Ban immediately
    {
      id: 18,
      name: "Richard Hall",
      email: "rhall@gmail.com",
      avatar: "https://picsum.photos/200?random=18",
      mockTime: 6 * 24 * 60 * 60,
    }, // 6 days
    {
      id: 19,
      name: "Jennifer Young",
      email: "jyoung@gmail.com",
      avatar: "https://picsum.photos/200?random=19",
      mockTime: 4 * 30 * 24 * 60 * 60,
    }, // 4 months
    {
      id: 20,
      name: "William King",
      email: "wking@gmail.com",
      avatar: "https://picsum.photos/200?random=20",
      mockTime: 9 * 24 * 60 * 60,
    }, // 9 days
  ];

  return (
    <Container sx={{ flex: 1, paddingTop: 5, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
          mb: 10,
          borderRadius: 2,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main}, ${theme.palette.quinary.main})`,
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          Suspended Account
        </Typography>
        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          <SuspendData data={suspendData} />
        </Box>
      </Box>
    </Container>
  );
}
