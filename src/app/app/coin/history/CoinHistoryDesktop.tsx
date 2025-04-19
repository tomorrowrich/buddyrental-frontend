"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getTransactionHistory } from "@/api/payment/api";
import { TransactionResponse } from "@/api/payment/interface";

export default function CoinHistoryPage() {
  const theme = useTheme();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const result = await getTransactionHistory();
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
  }, []);

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
            padding: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
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
              Coin Package
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ p: 4, backgroundColor: "white" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
              {error}
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Transaction ID",
                    "Date",
                    "Package",
                    "Transaction Type",
                    "Amount",
                    "Status",
                  ].map((head) => (
                    <TableCell key={head} sx={{ fontWeight: 700 }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.id}</TableCell>
                      <TableCell>{formatDate(txn.createdAt)}</TableCell>
                      <TableCell>{txn.amount} Coins</TableCell>
                      <TableCell>{txn.type}</TableCell>
                      <TableCell>{formatAmount(txn.amount)}</TableCell>
                      <TableCell>{txn.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </Container>
  );
}
