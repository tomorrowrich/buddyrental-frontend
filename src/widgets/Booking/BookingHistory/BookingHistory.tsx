import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import { Booking } from "@/model/reservation";

export const BookingHistory = ({ data }: { data: Booking[] }) => {
  const theme = useTheme();
  return (
    <Box mt={2} flex={1}>
      {data.map((booking, index) => (
        <Box key={booking.reservationId}>
          <ReviewCard
            reservationId={booking.reservationId}
            name={
              booking.buddy.user.firstName + " " + booking.buddy.user.lastName
            }
            email={booking.buddy.user.email}
            avatar={booking.buddy.user.profilePicture || undefined}
            citizenId={booking.buddy.user.citizenId}
            phoneNumber={booking.buddy.user.phoneNumber}
            address={booking.buddy.user.address}
            rating={booking.buddy.ratingAvg}
            tags={booking.buddy.tags.map((i) => i.name)}
            reservationCreatedAt={new Date(booking.createdAt).toLocaleString()}
            reservationEnd={new Date(booking.reservationEnd).toLocaleString()}
          />
          {index < data.length - 1 && (
            <Divider
              sx={{ background: theme.palette.quinary.main }}
              variant="middle"
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
