"use client";
import "@/styles/globals.css";
import BuddyRentalTheme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/context/auth/auth";
import { BuddyRentalLoader } from "./loading";
import { Suspense } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ThemeProvider theme={BuddyRentalTheme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <main className="flex flex-col min-h-screen">
                  <Suspense fallback={<BuddyRentalLoader />}>
                    {children}
                  </Suspense>
                </main>
              </LocalizationProvider>
            </ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
