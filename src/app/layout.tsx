"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "@/styles/globals.css";
import { Box, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import { NavigationBar } from "@/widgets/NavigationBar";
import { AuthProvider } from "@/context/auth";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadBackdrop from "@/screens/LoadBackdrop";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

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
            <ThemeProvider theme={theme}>
              <main className="flex flex-col min-h-screen">
                <LoadBackdrop open={isLoading} />
                <NavigationBar />
                <Box flex={1} sx={{ display: "flex", flexDirection: "column" }}>
                  {children}
                </Box>
              </main>
            </ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
