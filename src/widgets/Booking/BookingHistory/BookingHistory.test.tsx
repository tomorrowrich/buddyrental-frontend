import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingHistory } from "./BookingHistory";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "@testing-library/jest-dom";
import { Reservation } from "@/model/reservation";

describe("BookingHistory", () => {
  const mockData: Reservation[] = [
    {
      reservationId: "550e8400-e29b-41d4-a716-446655440000",
      price: 100,
      reservationStart: "2023-01-01T10:00:00Z",
      reservationEnd: "2023-01-01T12:00:00Z",
      createdAt: "2023-01-01T09:00:00Z",
      updatedAt: "2023-01-01T09:00:00Z",
      status: "confirmed",
      user: {
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        email: "user@example.com",
      },
      buddy: {
        buddyId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
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
        ratingAvg: 4.5,
        tags: [{ id: 1, name: "Gaming" }],
      },
    },
    {
      reservationId: 2,
      price: 150,
      reservationStart: "2023-01-02T10:00:00Z",
      reservationEnd: "2023-01-02T12:00:00Z",
      createdAt: "2023-01-02T09:00:00Z",
      updatedAt: "2023-01-02T09:00:00Z",
      status: "confirmed",
      user: {
        userId: 1,
        email: "user@example.com",
      },
      buddy: {
        buddyId: 2,
        user: {
          userId: 3,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          profilePicture: "https://example.com/avatar2.jpg",
          citizenId: "9876543210123",
          phoneNumber: "0823456789",
          address: "456 Oak St",
        },
        ratingAvg: 4.8,
        tags: [{ id: 2, name: "Reading" }],
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
