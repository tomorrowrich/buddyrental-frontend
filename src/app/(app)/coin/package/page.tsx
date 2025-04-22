"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import CoinPackageMobile from "./CoinPackageMobile";
import CoinPackageDesktop from "./CoinPackageDesktop";

export default function CoinPackagePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? <CoinPackageMobile /> : <CoinPackageDesktop />;
}
