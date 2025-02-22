import { User } from "@/model/user";
import BuddyRentalTheme from "@/theme";
import { ThemeProvider } from "@mui/material";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VerficationCard } from "./VerificationCard";

const mockProps: User = {
  userId: "8f2165a8-2218-49ed-b0f3-741b61a233d0",
  firstName: "John",
  lastName: "Doe",
  citizenId: "123456789",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  verified: false,
  displayName: "Xx_Mist3rJohn_xX",
  gender: "MALE",
  dateOfBirth: "1990-01-01T00:00:00.000Z",
  address: "123 Main Street",
  city: "Tennessee",
  postalCode: "12345",
  profilePicture: "https://picsum.photos/200",
  description: "",
};

const verifyUserMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ success: true, error: null }),
);
vi.mock("@/api/verify/api", () => ({ verifyUser: verifyUserMock }));

const themeRenderer = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={BuddyRentalTheme}>{component}</ThemeProvider>,
  );
};

describe("BookingCard", () => {
  it("renders basic user information", () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    const name = mockProps.firstName + " " + mockProps.lastName;
    expect(screen.getByText(name, { exact: false })).toBeInTheDocument();
    expect(screen.getByAltText(name)).toBeInTheDocument(); // Avatar
    expect(
      screen.getByText(mockProps.email, { exact: false }),
    ).toBeInTheDocument();
  });

  it("opens dialog when Details button is clicked", async () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    const detailsButton = screen.getByText("Details");
    fireEvent.click(detailsButton);

    // Check if dialog content is displayed
    expect(screen.getByText("Identity Card Number")).toBeInTheDocument();
    expect(screen.getByText(mockProps.citizenId)).toBeInTheDocument();

    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText(mockProps.phoneNumber)).toBeInTheDocument();

    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText(mockProps.address)).toBeInTheDocument();
  });

  it("renders approval buttons in dialog", () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    fireEvent.click(screen.getByText("Details"));

    expect(screen.getByText("Reject")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
  });

  it("calls verifyUser API when Approve button is clicked", async () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    fireEvent.click(screen.getByText("Details"));
    fireEvent.click(screen.getByText("Approve"));

    expect(verifyUserMock).toHaveBeenCalledWith(true, mockProps.userId);
    await screen.findByText("Details"); // Wait for re-render
  });

  it("opens reject dialog when Reject button is clicked", () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    fireEvent.click(screen.getByText("Details"));
    fireEvent.click(screen.getByText("Reject"));

    expect(screen.getByText("Reject letter")).toBeInTheDocument();
  });

  it("closes dialog when Close icon is clicked", async () => {
    themeRenderer(<VerficationCard {...mockProps} onChange={() => {}} />);

    fireEvent.click(screen.getByText("Details"));
    fireEvent.click(screen.getByRole("button", { name: /close-button/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Identity Card Number"),
      ).not.toBeInTheDocument();
    });
  });
});
