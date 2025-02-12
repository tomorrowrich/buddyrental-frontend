import { describe, it, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VerificationPage from "@/app/(user)/verify/page";
import { ThemeProvider } from "@emotion/react";
import BuddyRentalTheme from "@/theme";

describe("VerificationPage", () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={BuddyRentalTheme}>
        <VerificationPage />
      </ThemeProvider>,
    );
  });

  it("renders the main title messages", () => {
    expect(screen.getByText("Please wait for verification.")).toBeDefined();
    expect(screen.getByText("Thanks for joining BuddyRental!")).toBeDefined();
  });

  it("displays the verification message", () => {
    expect(
      screen.getByText(
        "Please wait for verification from admin. We will send you an email!",
      ),
    ).toBeDefined();
  });

  it("shows all stepper steps", () => {
    expect(screen.getByText("Fill Information")).toBeDefined();
    expect(screen.getByText("Verification")).toBeDefined();
    expect(screen.getByText("Complete!")).toBeDefined();
  });

  it("renders the thanks button", () => {
    expect(screen.getByRole("button", { name: "Thanks!" })).toBeDefined();
  });
});
