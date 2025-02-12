import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "@testing-library/jest-dom";
import { VerificationRequest } from "./VerificationHistory";

describe("BookingHistory", () => {
  const mockData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://example.com/avatar2.jpg",
    },
  ];

  const renderVerificationRequest = (props = { data: mockData }) => {
    return render(
      <ThemeProvider theme={theme}>
        <VerificationRequest {...props} />
      </ThemeProvider>,
    );
  };

  it("renders without crashing", () => {
    renderVerificationRequest();
  });

  it("renders correct number of BookingCards", () => {
    renderVerificationRequest();
    // Check if the correct number of names are rendered
    const names = screen.getAllByText(/John Doe|Jane Smith/);
    expect(names).toHaveLength(2);
  });

  it("renders with empty data", () => {
    renderVerificationRequest({ data: [] });
    // Component should render without throwing errors
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("displays user information correctly", () => {
    renderVerificationRequest();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
