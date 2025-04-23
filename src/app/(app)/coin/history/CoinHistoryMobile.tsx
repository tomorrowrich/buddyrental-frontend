"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
  Button,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getTransactionHistory } from "@/api/payment/api";
import { TransactionResponse } from "@/api/payment/interface";

export default function CoinHistoryMobile() {
  const theme = useTheme();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const itemCount = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const skip = (page - 1) * itemCount;
        const result = await getTransactionHistory(undefined, itemCount, skip);
        setTransactions(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load transactions");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, itemCount]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const pad = (n: number) => (n < 10 ? "0" + n : n);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = String(date.getFullYear()).slice(-2);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatAmount = (amount: number, currency: string = "Baht") => {
    return `${amount} ${currency}`;
  };

  return (
    <Container sx={{ flex: 1, pt: 5, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
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
            Coin History
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push("/app/coin/package")}
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
            Package
          </Button>
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 4,
              backgroundColor: "white",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "white",
            }}
          >
            {transactions.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography>No transactions found</Typography>
              </Box>
            ) : (
              <>
                {transactions.map((txn) => (
                  <Card
                    key={txn.id}
                    sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}
                  >
                    <CardContent sx={{ padding: "8px !important" }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight={600}
                        gutterBottom
                      >
                        Transaction ID
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{ mb: 1 }}
                      >
                        {txn.id}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          <strong>Date:</strong>{" "}
                          <Typography component="span" color="text.secondary">
                            {formatDate(txn.createdAt)}
                          </Typography>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Package:</strong>{" "}
                          <Typography component="span" color="text.secondary">
                            {txn.amount} Coins
                          </Typography>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Transaction Type:</strong>{" "}
                          <Typography component="span" color="text.secondary">
                            {txn.type}
                          </Typography>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Amount:</strong>{" "}
                          <Typography component="span" color="text.secondary">
                            {formatAmount(txn.amount)}
                          </Typography>
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            color:
                              txn.status === "PENDING" ? "orange" : "green",
                          }}
                        >
                          <strong>Status:</strong> {txn.status}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <IconButton
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ArrowBack />
                  </IconButton>

                  <Typography variant="body2">Page {page}</Typography>

                  <IconButton
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={transactions.length < itemCount}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
