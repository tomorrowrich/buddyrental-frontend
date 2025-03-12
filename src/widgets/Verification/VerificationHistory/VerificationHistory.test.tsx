import { User } from "@/model/user";
import BuddyRentalTheme from "@/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VerificationRequest } from "./VerificationHistory";

const mockData: User[] = [
  {
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
    profilePicture: "https://picsum.photos/200?random=1",
    description: "",
  },
  {
    userId: "8f2165a8-2218-49ed-b0f3-741b61a233d1",
    firstName: "Jane",
    lastName: "Doe",
    citizenId: "123456788",
    email: "jane.doe@example.com",
    phoneNumber: "+1234567891",
    verified: false,
    displayName: "Xx_Mist3rJane_xX",
    gender: "FEMALE",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    address: "123 Main Street",
    city: "Tennessee",
    postalCode: "12345",
    profilePicture: "https://picsum.photos/200?random=2",
    description: "",
  },
];

const verifyUserMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ success: true, error: null }),
);
vi.mock("@/api/verify/api", () => ({ verifyUser: verifyUserMock }));

const themeRenderer = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={BuddyRentalTheme}>{component}</ThemeProvider>,
  );
};

describe("Verification Requests", () => {
  it("renders without crashing", () => {
    themeRenderer(<VerificationRequest data={mockData} onChange={() => {}} />);
  });

  it("renders correct number of VerificationCards", () => {
    themeRenderer(<VerificationRequest data={mockData} onChange={() => {}} />);
    const names = screen.getAllByText(/John Doe|Jane Doe/);
    expect(names).toHaveLength(2);
  });

  it("calls onChange when a user is verified", async () => {
    const mockOnChange = vi.fn();
    themeRenderer(
      <VerificationRequest data={mockData} onChange={mockOnChange} />,
    );

    const detailsButtons = screen.getAllByText("Details");
    fireEvent.click(detailsButtons[0]);

    const approveButton = screen.getByText("Approve");
    await fireEvent.click(approveButton);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("renders with empty data", () => {
    themeRenderer(<VerificationRequest data={[]} onChange={() => {}} />);
    expect(screen.queryByText(/John Doe|Jane Doe/)).toBeNull();
  });

  it("displays user information correctly", () => {
    themeRenderer(<VerificationRequest data={mockData} onChange={() => {}} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });
});
