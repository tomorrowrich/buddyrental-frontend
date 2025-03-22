"use client";

import {
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

// สร้างเส้นเชื่อมที่มีสีเดียวกับวงกลม
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  "&.MuiStepConnector-root": {
    top: 10, // จัดให้เส้นอยู่ตรงกลาง
  },
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.secondary.main, // กำหนดสีของเส้น
    borderWidth: 2,
  },
}));

// สร้างไอคอนวงกลมที่ไม่มีสัญลักษณ์ข้างใน
const CustomStepIcon = styled("div")<{ active?: boolean; completed?: boolean }>(
  ({ theme, active, completed }) => ({
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor:
      completed || active ? theme.palette.secondary.main : "#ddd",
    border: `2px solid ${completed || active ? theme.palette.secondary.main : "#bbb"}`,
  }),
);

export default function VerificationStatusPage() {
  const router = useRouter();

  // กำหนดสถานะปัจจุบัน (0 = เริ่ม, 1 = กำลัง Verify, 2 = เสร็จสมบูรณ์)
  const currentStep = 1;

  const steps = ["Fill Information", "Verification", "Complete"];

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Please wait for verification.
      </Typography>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thanks for joining BuddyRental
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please wait for verification from admin. We will alert you via email!
      </Typography>

      {/* Stepper ที่ปรับแต่ง */}
      <Stepper
        activeStep={currentStep}
        alternativeLabel
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  active={props.active}
                  completed={props.completed}
                />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ปุ่ม Thanks */}
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{ mt: 3, width: "100%" }} // เพิ่ม width: "100%" เพื่อให้ปุ่มยาวเต็ม
        onClick={() => router.push("/login")}
      >
        Thanks
      </Button>
    </Container>
  );
}
