import BuddyRentalTheme from "@/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import VerificationRejectDialog from "./VerificationRejectDialog";

const verifyUserMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ success: true, error: null }),
);
vi.mock("@/api/verify/api", () => ({ verifyUser: verifyUserMock }));

const themeRenderer = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={BuddyRentalTheme}>{component}</ThemeProvider>,
  );
};

describe("Verification Reject Dialog", () => {
  it("renders dialog with reject reason form", () => {
    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={() => {}}
        user={{ userId: "", name: "" }}
      />,
    );

    expect(screen.getByText("Reject letter")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason 3")).toBeInTheDocument();
  });

  it("allows selecting and deselecting reasons", () => {
    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={() => {}}
        user={{ userId: "", name: "" }}
      />,
    );

    const reason1Checkbox = screen.getByLabelText("Inaccurate Information");
    fireEvent.click(reason1Checkbox);
    expect(reason1Checkbox).toBeChecked();

    fireEvent.click(reason1Checkbox);
    expect(reason1Checkbox).not.toBeChecked();
  });

  it("allows entering an extra reason", () => {
    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={() => {}}
        user={{ userId: "", name: "" }}
      />,
    );

    const extraReasonInput = screen.getByPlaceholderText(
      "Give an extra reason for :(",
    );
    fireEvent.change(extraReasonInput, {
      target: { value: "Additional reason" },
    });
    expect(extraReasonInput).toHaveValue("Additional reason");
  });

  it("calls onClose when the close button is clicked", () => {
    const onCloseMock = vi.fn();
    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={onCloseMock}
        user={{ userId: "", name: "" }}
      />,
    );

    const closeButton = screen.getByRole("button", { name: /close-button/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls verifyUser API with correct parameters when reject button is clicked", async () => {
    const onCloseMock = vi.fn();

    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={onCloseMock}
        user={{ userId: "123", name: "John Doe" }}
      />,
    );

    const reason1Checkbox = screen.getByLabelText("Inaccurate Information");
    fireEvent.click(reason1Checkbox);

    const rejectButton = screen.getByRole("button", { name: /reject/i });
    await fireEvent.click(rejectButton);

    expect(verifyUserMock).toHaveBeenCalledWith(
      false,
      "123",
      "Inaccurate Information",
    );
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls verifyUser API with correct parameters when multiple reasons are selected", async () => {
    const onCloseMock = vi.fn();

    themeRenderer(
      <VerificationRejectDialog
        open={true}
        onClose={onCloseMock}
        user={{ userId: "123", name: "John Doe" }}
      />,
    );

    const reason1Checkbox = screen.getByLabelText("Inaccurate Information");
    fireEvent.click(reason1Checkbox);

    const extraReasonInput = screen.getByPlaceholderText(
      "Give an extra reason for John Doe :(",
    );
    fireEvent.change(extraReasonInput, {
      target: { value: "Additional reason" },
    });

    const rejectButton = screen.getByRole("button", { name: /reject/i });
    await fireEvent.click(rejectButton);

    expect(verifyUserMock).toHaveBeenCalledWith(
      false,
      "123",
      "Inaccurate Information and Other: Additional reason",
    );
    expect(onCloseMock).toHaveBeenCalled();
  });
});
