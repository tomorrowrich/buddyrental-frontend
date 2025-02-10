import { describe, it, vi, beforeEach } from "vitest";
import Login from "./page";
import { render } from "@/test/test-utils";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@emotion/react";
import BuddyRentalTheme from "@/theme";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <ThemeProvider theme={BuddyRentalTheme}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>,
    );
  });

  it("renders without crashing", () => {});
});
