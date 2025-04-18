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
import {
  getReports,
  getSuspendUser,
  setBan,
  setSuspendTime,
} from "@/api/report/api";
import { User } from "@/model/user";

const SuspendData = ({
  data,
  onResolved,
}: {
  data: User[];
  onResolved?: () => void;
}) => {
  const theme = useTheme();

  const handleUnban = async (id: string) => {
    try {
      await setBan(id, false);
      await setSuspendTime(id, 0);
      alert("User unbanned successfully!");
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
    onResolved?.();
  };

  const handleUnsuspend = async (id: string) => {
    try {
      await setSuspendTime(id, 0);
      alert("User unsuspended successfully!");
    } catch (error) {
      console.error("Error unsuspending user:", error);
    }
    onResolved?.();
  };

  if (data.length === 0) {
    return <Typography>No suspended or banned users found.</Typography>; // กรณีไม่มีผู้ใช้
  }

  // console.log("data", data);

  return (
    <Box>
      {data.map((account) => {
        const isSuspended =
          account.suspendedUntil &&
          new Date(account.suspendedUntil).getTime() > Date.now();
        const isBanned = account.isBanned;
        return (
          <Box key={account.userId}>
            {" "}
            {/* ใส่ key ให้กับ Box แม่ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                key={account.userId} // เพิ่ม key ที่นี่ด้วย
              >
                <Avatar
                  src={account.profilePicture}
                  alt={account.displayName}
                />
                <Box>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {account.displayName}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {account.email}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isSuspended && !isBanned && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 3 }}
                    onClick={() => handleUnsuspend(account.userId)}
                  >
                    Unsuspend
                  </Button>
                )}
                {isBanned && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 3 }}
                    onClick={() => handleUnban(account.userId)}
                  >
                    Unban
                  </Button>
                )}
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

export default function SuspendAccount() {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]); // State สำหรับเก็บข้อมูลผู้ใช้

  const fetchData = async () => {
    try {
      const reports = await getReports("RESOLVED");
      const filteredReports = reports.filter(
        (report) =>
          report.categoryId === "28b62f4e-82b1-4ad1-b337-ac00e792a214",
      );

      const suspendedUsersResults = await Promise.all(
        filteredReports.map(async (report) => {
          const user = await getSuspendUser(report);
          return user;
        }),
      );

      // console.log("suspend", suspendedUsersResults);
      // console.log("date", Date.now());
      // Filter หลังจาก resolve แล้ว
      const validUsers = suspendedUsersResults.filter(
        (user) =>
          user.isBanned === true ||
          new Date(user.suspendedUntil).getTime() > Date.now(),
      );
      // console.log("validUsers",  validUsers);

      if (validUsers.length === 0) {
        setUsers([]);
        return;
      }

      // ลบผู้ใช้ที่ซ้ำกันโดยใช้ id
      const uniqueUsers = Array.from(
        new Map(validUsers.map((user) => [user.id, user])).values(),
      );

      setUsers(uniqueUsers);
    } catch (error) {
      console.error("Error fetching suspended or banned users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          Suspended & Banned Accounts
        </Typography>
        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          <SuspendData data={users} onResolved={fetchData} />
        </Box>
      </Box>
    </Container>
  );
}
