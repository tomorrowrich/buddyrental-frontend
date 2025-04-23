import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Reservation } from "@/model/reservation";
import { ReservationCard } from "../ReservationCard/ReservationCard";

export const ReservationHistory = ({ data }: { data: Reservation[] }) => {
  const theme = useTheme();
  return (
    <Box mt={2} flex={1}>
      {data.map((booking, index) => (
        <Box key={booking.reservationId}>
          <ReservationCard
            reservationId={booking.reservationId}
            name={booking.user.firstName + " " + booking.user.lastName}
            email={booking.user.email}
            avatar={booking.user.profilePicture || undefined}
            citizenId={booking.user.citizenId}
            phoneNumber={booking.user.phoneNumber}
            address={booking.user.address}
            reservationCreatedAt={new Date(booking.createdAt).toLocaleString()}
            reservationEnd={new Date(booking.reservationEnd).toLocaleString()}
            reservationStart={new Date(
              booking.reservationStart,
            ).toLocaleString()}
            detail={booking.detail}
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
