import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BuddyRentalLoader } from "./loading";
import { render } from "@/test/test-utils";

describe("BuddyRentalLoader", () => {
  it("renders loading component with theme", () => {
    render(<BuddyRentalLoader />);
    const progressBar = screen.getByTestId("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.parentElement).toHaveStyle("color: #fff");
  });

  it("renders with backdrop", () => {
    const { container } = render(<BuddyRentalLoader />);
    expect(container.querySelector(".MuiBackdrop-root")).toBeVisible();
  });
});
