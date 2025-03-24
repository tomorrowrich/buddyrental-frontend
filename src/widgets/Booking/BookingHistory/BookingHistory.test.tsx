import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingHistory } from "./BookingHistory";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "@testing-library/jest-dom";
import { Booking } from "@/model/reservation";

describe("BookingHistory", () => {
  const mockData: Booking[] = [
    {
      reservationId: "550e8400-e29b-41d4-a716-446655440000",
      price: 100,
      reservationStart: "2023-01-01T10:00:00Z",
      reservationEnd: "2023-01-01T12:00:00Z",
      status: "ACCEPTED",
      userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      buddyId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      scheduleId: "schedule-001",
      createdAt: "2023-01-01T09:00:00Z",
      buddy: {
        buddyId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        balanceWithdrawable: 75,
        description:
          "Professional gaming buddy with experience in various games",
        ratingAvg: 4.5,
        totalReviews: 12,
        priceMin: 50,
        priceMax: 150,
        tagsCount: 1,
        userId: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        createdAt: "2022-12-15T08:00:00Z",
        user: {
          userId: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          profilePicture: "https://example.com/avatar1.jpg",
          citizenId: "1234567890123",
          phoneNumber: "0812345678",
          address: "123 Main St",
        },
        tags: [{ tagId: "1", name: "Gaming" }],
      },
    },
    {
      reservationId: "550e8400-e29b-41d4-a716-446655440001",
      price: 150,
      reservationStart: "2023-01-02T10:00:00Z",
      reservationEnd: "2023-01-02T12:00:00Z",
      status: "REJECTED",
      userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
      buddyId: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      scheduleId: "schedule-002",
      createdAt: "2023-01-02T09:00:00Z",
      buddy: {
        buddyId: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
        balanceWithdrawable: 100,
        description: "Experienced reading companion",
        ratingAvg: 4.8,
        totalReviews: 15,
        priceMin: 75,
        priceMax: 200,
        tagsCount: 1,
        userId: "7c9e6679-7425-40de-944b-e07fc1f90ae8",
        createdAt: "2022-12-10T08:00:00Z",
        user: {
          userId: "7c9e6679-7425-40de-944b-e07fc1f90ae8",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          profilePicture: "https://example.com/avatar2.jpg",
          citizenId: "9876543210123",
          phoneNumber: "0823456789",
          address: "456 Oak St",
        },
        tags: [{ tagId: "2", name: "Reading" }],
      },
    },
  ];

  const renderBookingHistory = (props = { data: mockData }) => {
    return render(
      <ThemeProvider theme={theme}>
        <BookingHistory {...props} />
      </ThemeProvider>,
    );
  };

  it("renders without crashing", () => {
    renderBookingHistory();
  });

  it("renders correct number of ReviewCards", () => {
    renderBookingHistory();
    // Check if the correct number of names are rendered
    const names = screen.getAllByText(/John Doe|Jane Smith/);
    expect(names).toHaveLength(2);
  });

  it("renders with empty data", () => {
    renderBookingHistory({ data: [] });
    // Component should render without throwing errors
    expect(screen.queryByText(/John Doe|Jane Smith/)).toBeNull();
  });

  it("displays user information correctly", () => {
    renderBookingHistory();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
