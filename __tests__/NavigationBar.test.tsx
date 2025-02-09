import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationBar } from "@/widgets/NavigationBar";
import { useAuth } from "@/context/auth";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";

// Mock the useAuth hook
vi.mock("@/context/auth", () => ({
  useAuth: vi.fn(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

const customRender = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("NavigationBar", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({
        isAuthenticated: true,
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
        logout: mockLogout,
      });
    });

    it("renders authenticated user interface", () => {
      customRender(<NavigationBar />);

      expect(screen.getByText("Bookings")).toBeDefined();
      expect(screen.getByText("Chat")).toBeDefined();
      expect(screen.getByText("123.00")).toBeDefined();
    });

    it("opens user menu on avatar click", () => {
      customRender(<NavigationBar />);

      const avatar = screen.getByRole("img", { name: "User" });
      fireEvent.click(avatar);

      expect(screen.getByText("John Doe")).toBeDefined();
      expect(screen.getByText("john@example.com")).toBeDefined();
      expect(screen.getByText("Edit Profile")).toBeDefined();
      expect(screen.getByText("Settings")).toBeDefined();
      expect(screen.getByText("Logout")).toBeDefined();
    });

    it("calls logout when logout button is clicked", () => {
      customRender(<NavigationBar />);

      const avatar = screen.getByAltText("User");
      fireEvent.click(avatar);

      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe("when not authenticated", () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (useAuth as any).mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });
    });

    it("renders unauthenticated user interface", () => {
      customRender(<NavigationBar />);

      expect(screen.queryByText("Bookings")).toBeNull();
      expect(screen.queryByText("Chat")).toBeNull();
      expect(screen.queryByText("123.00")).toBeNull();
    });
  });
});
