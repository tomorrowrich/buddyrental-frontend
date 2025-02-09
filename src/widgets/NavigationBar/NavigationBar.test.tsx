import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";
import { useAuth } from "@/context/auth";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "@testing-library/jest-dom";

// Mock the useAuth hook
vi.mock("@/context/auth", () => ({
  useAuth: vi.fn(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @next/next/no-img-element, jsx-a11y/alt-text
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      expect(screen.getByText("Bookings")).toBeInTheDocument();
      expect(screen.getByText("Chat")).toBeInTheDocument();
      expect(screen.getByText("123.00")).toBeInTheDocument();
    });

    it("opens user menu on avatar click", () => {
      customRender(<NavigationBar />);
      const avatar = screen.getByTestId("user-avatar");
      fireEvent.click(avatar);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("calls logout when logout button is clicked", () => {
      customRender(<NavigationBar />);
      const avatar = screen.getByTestId("user-avatar");
      fireEvent.click(avatar);

      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalled();
    });

    it("renders navigation buttons with correct class names", () => {
      customRender(<NavigationBar />);
      const bookingsButton = screen.getByText("Bookings").closest("button");
      const chatButton = screen.getByText("Chat").closest("button");

      expect(bookingsButton).toHaveClass("MuiButton-root");
      expect(chatButton).toHaveClass("MuiButton-root");
    });

    it("displays correct balance with add button", () => {
      customRender(<NavigationBar />);
      const balance = screen.getByText("123.00");
      const addButton = screen.getByTestId("AddIcon");

      expect(balance).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });

    it("handles menu visibility correctly", async () => {
      customRender(<NavigationBar />);
      const avatar = screen.getByTestId("user-avatar");

      // Initially menu should not be visible
      expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();

      // Open menu
      fireEvent.click(avatar);
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    it("handles profile navigation buttons correctly", () => {
      const mockNavigate = vi.fn();
      vi.mock("next/navigation", () => ({
        useRouter: () => ({ push: mockNavigate }),
      }));

      customRender(<NavigationBar />);

      const avatar = screen.getByRole("img", { name: "User" });
      fireEvent.click(avatar);

      const editProfileButton = screen.getByText("Edit Profile");
      const settingsButton = screen.getByText("Settings");

      fireEvent.click(editProfileButton);
      expect(screen.queryByText("Edit Profile")).not.toBeVisible();

      fireEvent.click(avatar);
      fireEvent.click(settingsButton);
      expect(screen.queryByText("Settings")).not.toBeVisible();
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

    it("renders logo correctly", () => {
      customRender(<NavigationBar />);
      const logo = screen.getByAltText("BuddyRental Logo");

      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("width", "200");
      expect(logo).toHaveAttribute("height", "40");
    });

    it("renders default avatar", () => {
      customRender(<NavigationBar />);
      const avatar = screen.getByTestId("user-avatar");

      expect(avatar).toBeInTheDocument();
      fireEvent.click(avatar);
      expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    });
  });
});
