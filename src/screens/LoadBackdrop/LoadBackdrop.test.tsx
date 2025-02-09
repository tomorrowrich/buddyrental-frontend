import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadBackdrop } from "./LoadBackdrop";

describe("LoadBackdrop", () => {
  it("should not be visible when open is false", () => {
    render(<LoadBackdrop open={false} />);
    const backdrop = screen.queryByTestId("backdrop");
    expect(backdrop).not.toBeVisible();
  });

  it("should be visible when open is true", () => {
    render(<LoadBackdrop open={true} />);
    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop).toBeInTheDocument();
  });

  it("should render the logo image", () => {
    render(<LoadBackdrop open={true} />);
    const logo = screen.getByAltText("BuddyRental Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      "src",
      expect.stringContaining("logo-full.svg"),
    );
  });

  it("should render the loading spinner", () => {
    render(<LoadBackdrop open={true} />);
    const spinner = screen.getByRole("progressbar", { hidden: true });
    expect(spinner).toBeInTheDocument();
  });
});
