"use client";
import { getUnverifiedUsers, verifyUser } from "@/api/verify/api";
import { User } from "@/model/user";
import { VerficationCard } from "@/widgets/Verification/VerificationCard/VerificationCard";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
  const theme = useTheme();
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);

  const fetchUnverifiedUsers = async () => {
    try {
      const { success, users, error } = await getUnverifiedUsers();
      console.log("API response:", { success, users, error });

      if (success) {
        // ตรวจสอบว่า users ถูกต้องหรือไม่
        if (Array.isArray(users)) {
          console.log("Unverified users:", users);
          setUnverifiedUsers(users); // อัปเดต unverifiedUsers
        } else if (users?.data && Array.isArray(users.data)) {
          // กรณีที่ data อยู่ใน users
          console.log("Unverified users from data:", users.data);
          setUnverifiedUsers(users.data); // ใช้ users.data
        } else {
          console.error("Data is not an array:", users);
          setUnverifiedUsers([]); // ถ้าไม่ใช่อาร์เรย์ตั้งค่าเป็นอาร์เรย์ว่าง
        }
      } else {
        console.error("Failed to fetch unverified users:", error);
        setUnverifiedUsers([]); // ถ้าล้มเหลวให้ตั้งค่าเป็นอาร์เรย์ว่าง
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching unverified users:",
        error,
      );
      setUnverifiedUsers([]); // ถ้ามีข้อผิดพลาดให้ตั้งค่าเป็นอาร์เรย์ว่าง
    }
  };

  // อนุมัติผู้ใช้
  const handleApprove = async (userId: string) => {
    const { success, error } = await verifyUser(true, userId);
    if (success) {
      setUnverifiedUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId),
      );
    } else {
      console.error("Failed to approve user:", error);
    }
  };

  // ปฏิเสธผู้ใช้
  const handleDecline = async (userId: string) => {
    const { success, error } = await verifyUser(
      false,
      userId,
      "User not approved",
    );
    if (success) {
      setUnverifiedUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId),
      );
    } else {
      console.error("Failed to decline user:", error);
    }
  };

  useEffect(() => {
    fetchUnverifiedUsers();
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
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main} , ${theme.palette.quinary.main})`,
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          Verification Management
        </Typography>

        <Box
          sx={{
            width: "100%",
            padding: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {unverifiedUsers.length > 0 ? (
            unverifiedUsers.map((user) => (
              <VerficationCard
                key={user.userId}
                {...user}
                onChange={fetchUnverifiedUsers} // Reload users when approved/rejected
              />
            ))
          ) : (
            <Typography>No unverified users found.</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
