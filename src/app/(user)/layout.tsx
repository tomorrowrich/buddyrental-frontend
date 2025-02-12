"use client";
import "@/styles/globals.css";
import BuddyRentalTheme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, ThemeProvider } from "@mui/material";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";
import { AuthProvider } from "@/context/auth";
import { BuddyRentalLoader } from "./loading";
import { Suspense } from "react";

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
              <main className="flex flex-col min-h-screen">
                <Suspense fallback={<BuddyRentalLoader />}>
                  <NavigationBar />
                  <Box
                    flex={1}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      backgroundColor: "background.default",
                    }}
                  >
                    {children}
                  </Box>
                </Suspense>
              </main>
            </ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
