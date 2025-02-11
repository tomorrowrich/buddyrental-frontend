// import { describe, it, expect } from "vitest";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { BookingCard } from "./BookingCard";
// import { ThemeProvider, createTheme } from "@mui/material";
// import "@testing-library/jest-dom";

// // Mock data
// const mockProps = {
//   name: "John Doe",
//   email: "john@example.com",
//   avatar: "https://example.com/avatar.jpg",
// };

// // Create a theme for testing
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#000000",
//     },
//     secondary: {
//       main: "#000000",
//     },
//     tertiary: {
//       main: "#000000",
//     },
//   },
// });

// // Wrapper component for MaterialUI theme
// const renderWithTheme = (component: React.ReactElement) => {
//   return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
// };

// describe("BookingCard", () => {
//   it("renders basic user information", () => {
//     renderWithTheme(<BookingCard {...mockProps} />);

//     expect(screen.getByText(mockProps.name)).toBeInTheDocument();
//     expect(screen.getByText(mockProps.email)).toBeInTheDocument();
//     expect(screen.getByAltText(mockProps.name)).toBeInTheDocument(); // Avatar
//   });

//   it("opens dialog when Details button is clicked", async () => {
//     renderWithTheme(<BookingCard {...mockProps} />);

//     const detailsButton = screen.getByText("Details");
//     fireEvent.click(detailsButton);

//     // Check if dialog content is displayed
//     expect(screen.getByText("Identity Card Number")).toBeInTheDocument();
//     expect(screen.getByText("Phone Number")).toBeInTheDocument();
//     expect(screen.getByText("Address")).toBeInTheDocument();
//   });

//   it("closes dialog when close button is clicked", () => {
//     renderWithTheme(<BookingCard {...mockProps} />);

//     // Open dialog
//     fireEvent.click(screen.getByText("Details"));

//     // Close dialog
//     const closeButton = screen.getByTestId("CloseIcon");
//     fireEvent.click(closeButton);

//     // Verify dialog is closed by checking if the content is not visible
//     expect(screen.queryByText("Identity Card Number")).not.toBeVisible();
//   });

//   it("displays booking dates in dialog", () => {
//     renderWithTheme(<BookingCard {...mockProps} />);

//     fireEvent.click(screen.getByText("Details"));

//     expect(screen.getByText("Booking Date: 11/11/2024")).toBeInTheDocument();
//     expect(screen.getByText("Hangout Date: 15/11/2024")).toBeInTheDocument();
//   });

//   it("renders cancel booking button in dialog", () => {
//     renderWithTheme(<BookingCard {...mockProps} />);

//     fireEvent.click(screen.getByText("Details"));

//     expect(screen.getByText("Cancel Booking")).toBeInTheDocument();
//   });
// });
