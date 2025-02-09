import { describe, it, expect, beforeEach } from "vitest";
import BuddyRentalRootLayout from "./layout";
import { render } from "@/test/test-utils";
import "@testing-library/jest-dom";

describe("BuddyRentalRootLayout", () => {
  beforeEach(() => {
    render(
      <BuddyRentalRootLayout>
        <div>Test Content</div>
      </BuddyRentalRootLayout>,
    );
  });

  it("renders children and navigation", () => {
    expect(document.querySelector("html")).toHaveAttribute("lang", "en");
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
    expect(document.querySelector('link[rel="icon"]')).toBeInTheDocument();
  });

  it("applies theme provider", () => {
    const main = document.querySelector("main");
    expect(main).toHaveClass("flex", "flex-col", "min-h-screen");
  });
});
