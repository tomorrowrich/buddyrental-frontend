"use client";

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
} from "@mui/material";
import { useRouter } from "next/navigation";

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
    id: "56785678",
    date: "13/05/23 14:20",
    package: "500 Coins",
    method: "Credit Card",
    amount: "500 Baht",
    status: "Fail",
  },
];

export default function CoinHistoryMobile() {
  const theme = useTheme();
  const router = useRouter();

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

        {/* Transactions */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {transactions.map((txn, index) => (
            <Card key={index} sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
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
                      {txn.date}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Package:</strong>{" "}
                    <Typography component="span" color="text.secondary">
                      {txn.package}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Method:</strong>{" "}
                    <Typography component="span" color="text.secondary">
                      {txn.method}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Amount:</strong>{" "}
                    <Typography component="span" color="text.secondary">
                      {txn.amount}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: txn.status === "Success" ? "green" : "error.main",
                    }}
                  >
                    <strong>Status:</strong> {txn.status}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
