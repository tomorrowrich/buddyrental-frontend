import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "@testing-library/jest-dom";

describe("Booking History Page", () => {
  const renderPage = () => {
    return render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>,
    );
  };

  it("renders the booking history page", () => {
    renderPage();

    // Check if the title is rendered
    expect(screen.getByText("Booking History")).toBeInTheDocument();

    // Check if the booking history container exists
    expect(screen.getByTestId("booking-history-container")).toBeInTheDocument();
  });

  it("displays the booking data correctly", () => {
    renderPage();

    // Check if the first booking entry is rendered
    expect(screen.getByText("Alexa Rawles")).toBeInTheDocument();
    expect(screen.getByText("alexarawles@gmail.com")).toBeInTheDocument();

    // Check if the last booking entry is rendered
    expect(screen.getByText("William King")).toBeInTheDocument();
    expect(screen.getByText("wking@gmail.com")).toBeInTheDocument();
  });

  it("renders within a container with proper styling", () => {
    renderPage();

    const container = screen.getByTestId("booking-history-container");

    // Check if the container has the correct styling
    expect(container).toHaveStyle({
      width: "100%",
      padding: "16px", // 2 * 8px (default MUI spacing)
    });
  });
});
