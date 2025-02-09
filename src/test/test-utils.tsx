import { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "@/context/auth";

export function render(ui: ReactElement) {
  return rtlRender(
    <AppRouterCacheProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </AuthProvider>
    </AppRouterCacheProvider>,
  );
}

export * from "@testing-library/react";
