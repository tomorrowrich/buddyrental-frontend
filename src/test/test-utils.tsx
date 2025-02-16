import { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import BuddyRentalTheme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "@/context/auth/auth";

export function render(ui: ReactElement) {
  return rtlRender(
    <AppRouterCacheProvider>
      <AuthProvider>
        <ThemeProvider theme={BuddyRentalTheme}>{ui}</ThemeProvider>
      </AuthProvider>
    </AppRouterCacheProvider>,
  );
}

export * from "@testing-library/react";
