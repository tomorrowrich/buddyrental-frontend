"use client";

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
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function CoinHistoryPage() {
  const theme = useTheme();
  const router = useRouter();

  const transactions = [
    {
      id: "12341234",
      date: "12/05/23 12:40",
      package: "1000 Coins",
      method: "Promptpay",
      amount: "1000 Baht",
      status: "Success",
    },
    {
      id: "12341234",
      date: "12/05/23 12:40",
      package: "1000 Coins",
      method: "Promptpay",
      amount: "1000 Baht",
      status: "Fail",
    },
  ];

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
              onClick={() => router.push("/coin/package")}
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
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Transaction ID",
                  "Date",
                  "Package",
                  "Payment Method",
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
              {transactions.map((txn, index) => (
                <TableRow key={index}>
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.package}</TableCell>
                  <TableCell>{txn.method}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>{txn.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}
