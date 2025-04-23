"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import CoinHistoryMobile from "./CoinHistoryMobile";
import CoinHistoryDesktop from "./CoinHistoryDesktop";

export default function CoinHistoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? <CoinHistoryMobile /> : <CoinHistoryDesktop />;
}
