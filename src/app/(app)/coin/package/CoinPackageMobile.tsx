"use client";

import {
  Box,
  Container,
  Typography,
  useTheme,
  Button,
  Modal,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PaidIcon from "@mui/icons-material/Paid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCodeIcon from "@mui/icons-material/QrCode";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";

interface CoinPackage {
  price: number;
  coins: number;
}

export default function CoinPackagePageMobile() {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const coinPackages: CoinPackage[] = [
    { price: 100, coins: 100 },
    { price: 200, coins: 200 },
    { price: 300, coins: 300 },
    { price: 400, coins: 400 },
    { price: 500, coins: 500 },
    { price: 800, coins: 800 },
    { price: 1000, coins: 1000 },
    { price: 1500, coins: 1500 },
    { price: 2000, coins: 2000 },
    { price: 3500, coins: 3500 },
  ];

  const handleOpen = (pkg: CoinPackage) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleCloseAttempt = () => {
    setConfirmationOpen(true);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmCancel = () => {
    setOpen(false);
    setConfirmationOpen(false);
    setSelectedPackage(null);
    setPaymentMethod("credit");
  };

  const handlePaymentSuccess = () => {
    setOpen(false);
    setSuccessOpen(true);
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  const isCardInfoValid =
    cardNumber.trim() !== "" &&
    cardOwner.trim() !== "" &&
    selectedMonth !== "" &&
    selectedYear !== "" &&
    cvv.trim() !== "";

  return (
    <Container sx={{ flex: 1, paddingTop: 5, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          mb: 10,
          borderRadius: 8,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main}, ${theme.palette.quinary.main})`,
            p: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="white">
            Coin Package
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push("/app/coin/history")}
            sx={{
              borderRadius: "20px",
              fontWeight: 600,
              backgroundColor: "white",
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            History
          </Button>
        </Box>

        {/* Package List */}
        <Box sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {coinPackages.map((pkg) => (
              <Box
                key={pkg.price}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  gap: 1,
                  borderRadius: 3,
                  boxShadow: "0px 3px 15px rgba(237, 164, 189, 0.3)",
                  transition: "0.3s",
                  cursor: "pointer",
                  backgroundColor: "white",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(237, 164, 189, 0.6)",
                  },
                  width: {
                    xs: "42%",
                    sm: "30%",
                    md: "20%",
                  },
                }}
                onClick={() => handleOpen(pkg)}
              >
                <PaidIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.tertiary.main,
                  }}
                />
                <Typography fontWeight={600} color={theme.palette.primary.main}>
                  {pkg.price} THB
                </Typography>
                <Typography color="text.secondary">
                  {pkg.coins} Coins
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Modal open={open} onClose={handleCloseAttempt}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={handleCloseAttempt}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              color: theme.palette.secondary.main,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Payment Method
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 3,
            }}
          >
            {[
              {
                method: "credit",
                icon: <CreditCardIcon />,
                label: "Credit/Debit Card",
              },
              { method: "promptpay", icon: <QrCodeIcon />, label: "PromptPay" },
              {
                method: "mobile",
                icon: <SmartphoneIcon />,
                label: "Mobile Banking",
              },
            ].map(({ method, icon, label }) => (
              <Button
                key={method}
                variant="outlined"
                onClick={() => setPaymentMethod(method)}
                sx={{
                  justifyContent: "flex-start",
                  backgroundColor:
                    paymentMethod === method
                      ? theme.palette.secondary.main
                      : "white",
                  color:
                    paymentMethod === method
                      ? "white"
                      : theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor:
                      paymentMethod === method
                        ? theme.palette.secondary.dark
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                startIcon={icon}
              >
                {label}
              </Button>
            ))}
          </Box>

          {paymentMethod === "credit" && (
            <Box>
              <Typography variant="subtitle1" mb={1}>
                Card Information
              </Typography>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Owner"
                value={cardOwner}
                onChange={(e) => setCardOwner(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="Month"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem
                        key={i}
                        value={(i + 1).toString().padStart(2, "0")}
                      >
                        {(i + 1).toString().padStart(2, "0")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Year"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <MenuItem
                        key={i}
                        value={(new Date().getFullYear() + i)
                          .toString()
                          .slice(-2)}
                      >
                        {(new Date().getFullYear() + i).toString().slice(-2)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="CVV/CVC"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
          )}

          {paymentMethod === "promptpay" && (
            <Box textAlign="center">
              <Typography variant="subtitle1" mb={1}>
                QR Payment
              </Typography>
              <QrCodeIcon
                sx={{ fontSize: 120, color: theme.palette.tertiary.main }}
              />
            </Box>
          )}

          {paymentMethod === "mobile" && (
            <Box textAlign="center">
              <Typography variant="subtitle1" mb={1}>
                Mobile Banking
              </Typography>
              <Typography>ธนาคารต่าง ๆ</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="tertiary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handlePaymentSuccess}
            disabled={paymentMethod === "credit" && !isCardInfoValid}
          >
            Make Payment
          </Button>
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal open={confirmationOpen} onClose={handleCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon
            sx={{ fontSize: 80, color: theme.palette.tertiary.main }}
          />
          <Typography variant="h6" mt={2}>
            Cancel Payment
          </Typography>
          <Typography variant="caption" color="text.secondary" mt={1}>
            Are you sure you want to cancel the payment?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="tertiary"
              sx={{ padding: "8px 24px" }}
              onClick={handleConfirmCancel}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ padding: "8px 24px" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal open={successOpen} onClose={handleCloseSuccess}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 80, color: theme.palette.tertiary.main }}
          />
          <Typography variant="h6" mt={2}>
            Transaction Successful
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Coins: {selectedPackage?.coins}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="tertiary"
              sx={{
                mt: 3,
                alignSelf: "center",
                padding: "12px 30px",
              }}
              onClick={handleCloseSuccess}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
