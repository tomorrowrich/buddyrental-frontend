import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VerficationCard } from "./VerificationCard";
import { ThemeProvider, createTheme } from "@mui/material";
import "@testing-library/jest-dom";

// Mock data
const mockProps = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://example.com/avatar.jpg",
};

// Create a theme for testing
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#000000",
    },
    tertiary: {
      main: "#000000",
    },
  },
});

// Wrapper component for MaterialUI theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("BookingCard", () => {
  it("renders basic user information", () => {
    renderWithTheme(<VerficationCard {...mockProps} />);

    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.email)).toBeInTheDocument();
    expect(screen.getByAltText(mockProps.name)).toBeInTheDocument(); // Avatar
  });

  it("opens dialog when Details button is clicked", async () => {
    renderWithTheme(<VerficationCard {...mockProps} />);

    const detailsButton = screen.getByText("Details");
    fireEvent.click(detailsButton);

    // Check if dialog content is displayed
    expect(screen.getByText("Identity Card Number")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
  });

  it("renders reject button in dialog", () => {
    renderWithTheme(<VerficationCard {...mockProps} />);

    fireEvent.click(screen.getByText("Details"));

    expect(screen.getByText("Reject")).toBeInTheDocument();
  });
});
