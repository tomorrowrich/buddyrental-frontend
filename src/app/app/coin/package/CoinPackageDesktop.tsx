"use client";

import {
  Box,
  Container,
  Typography,
  useTheme,
  Button,
  Modal,
  IconButton,
  TextField,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import PaidIcon from "@mui/icons-material/Paid";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { purchaseCoins, withdrawCoins } from "@/api/payment/api";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface CoinPackage {
  price: number;
  coins: number;
}

export default function CoinPackagePage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);

  useEffect(() => {
    if (searchParams) {
      const success = searchParams.get("success");
      if (success === "true") {
        setSuccessOpen(true);
      } else if (success === "false") {
        setPaymentError("Payment was cancelled or failed. Please try again.");
        router.push("/app/coin/package");
      }
    }
  }, [searchParams]);

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
    setClientSecret(null);
    setPaymentError(null);
  };

  const handleCloseAttempt = () => {
    if (clientSecret) {
      setConfirmationOpen(true);
    } else {
      handleConfirmCancel();
    }
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmCancel = () => {
    setOpen(false);
    setConfirmationOpen(false);
    setSelectedPackage(null);
    setClientSecret(null);
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    router.push("/app/coin/package");
  };

  const StripeCheckout = useCallback(async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;

      const result = await purchaseCoins(selectedPackage.coins, redirectUrl);

      if (result.success && result.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        setPaymentError(result.error);
      }
    } catch (err) {
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (open && selectedPackage && !clientSecret && !isProcessing) {
      StripeCheckout();
    }
  }, [open, selectedPackage, clientSecret, isProcessing, StripeCheckout]);

  const handleWithdrawOpen = () => {
    setWithdrawOpen(true);
    setWithdrawAmount("");
    setWithdrawError(null);
  };

  const handleWithdrawClose = () => {
    setWithdrawOpen(false);
    setWithdrawAmount("");
    setWithdrawError(null);
  };

  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawAmount(value);
  };

  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || parseInt(withdrawAmount) <= 0) {
      setWithdrawError("Please enter a valid amount of coins to withdraw");
      return;
    }

    setIsWithdrawProcessing(true);
    setWithdrawError(null);

    try {
      const amount = parseInt(withdrawAmount);
      const result = await withdrawCoins(amount);

      if (result.success) {
        setWithdrawSuccess(true);
        setWithdrawOpen(false);
      } else {
        setWithdrawError(result.error);
      }
    } catch (err) {
      setWithdrawError("An error occurred. Please try again.");
    } finally {
      setIsWithdrawProcessing(false);
    }
  };

  const handleWithdrawSuccessClose = () => {
    setWithdrawSuccess(false);
    router.push("/app/coin/package");
  };

  const options = { clientSecret };

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
            alignItems: "center",
            justifyContent: "space-between",
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main}, ${theme.palette.quinary.main})`,
            p: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" fontWeight={700} color="white">
              Coin Packages
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

          {/* Withdraw Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={handleWithdrawOpen}
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
            Withdraw Coins
          </Button>
        </Box>

        {/* Display Error */}
        {paymentError && (
          <Box
            sx={{
              bgcolor: "#fee2e2",
              color: "#b91c1c",
              p: 2,
              mx: 3,
              mt: 2,
              borderRadius: 2,
            }}
          >
            <Typography>{paymentError}</Typography>
          </Box>
        )}

        {/* Package List */}
        <Box sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
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
                  padding: 3,
                  gap: 1,
                  borderRadius: 4,
                  boxShadow: "0px 3px 15px rgba(237, 164, 189, 0.3)",
                  transition: "0.3s",
                  cursor: "pointer",
                  backgroundColor: "white",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(237, 164, 189, 0.6)",
                  },
                  width: "15%",
                }}
                onClick={() => handleOpen(pkg)}
              >
                <PaidIcon
                  sx={{
                    fontSize: 50,
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

      {/* Payment Modal */}
      <Modal open={open} onClose={handleCloseAttempt}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            py: 4,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "auto",
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

          <Typography variant="h6" mb={2} px={4}>
            Purchase {selectedPackage?.coins} Coins
          </Typography>

          {isProcessing && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <Typography>Loading payment form...</Typography>
            </Box>
          )}

          {clientSecret && !isProcessing && (
            <Box sx={{ height: 400, my: 2 }}>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </Box>
          )}

          {!clientSecret && !isProcessing && paymentError && (
            <Button
              variant="contained"
              color="tertiary"
              sx={{
                mt: 3,
                alignSelf: "center",
                padding: "12px 30px",
              }}
              onClick={StripeCheckout}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Modal>

      {/* Withdraw Modal */}
      <Modal open={withdrawOpen} onClose={handleWithdrawClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={handleWithdrawClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: theme.palette.secondary.main,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={3} align="center">
            Withdraw Coins
          </Typography>

          {withdrawError && (
            <Box
              sx={{
                bgcolor: "#fee2e2",
                color: "#b91c1c",
                p: 2,
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Typography>{withdrawError}</Typography>
            </Box>
          )}

          <TextField
            label="Amount of coins to withdraw"
            variant="outlined"
            fullWidth
            value={withdrawAmount}
            onChange={handleWithdrawAmountChange}
            type="text"
            InputProps={{
              startAdornment: (
                <PaidIcon sx={{ color: theme.palette.tertiary.main, mr: 1 }} />
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="tertiary"
            onClick={handleWithdrawSubmit}
            disabled={isWithdrawProcessing}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {isWithdrawProcessing ? "Processing..." : "Withdraw"}
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
            width: 400,
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
            sx={{ fontSize: 100, color: theme.palette.tertiary.main }}
          />
          <Typography variant="h6" mt={2}>
            Cancel Payment
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Are you sure you want to cancel the payment?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="tertiary"
              sx={{
                mt: 3,
                alignSelf: "center",
                padding: "12px 30px",
              }}
              onClick={handleConfirmCancel}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                mt: 3,
                alignSelf: "center",
                padding: "12px 30px",
              }}
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
            width: 400,
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
            sx={{ fontSize: 100, color: theme.palette.tertiary.main }}
          />
          <Typography variant="h6" mt={2}>
            Transaction Successful
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Your coins have been added to your account.
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

      {/* Withdraw Success Modal */}
      <Modal open={withdrawSuccess} onClose={handleWithdrawSuccessClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
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
            sx={{ fontSize: 100, color: theme.palette.tertiary.main }}
          />
          <Typography variant="h6" mt={2}>
            Withdrawal Successful
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Coins have been withdrawn from your account.
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
              onClick={handleWithdrawSuccessClose}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
