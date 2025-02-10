import { Box, Divider } from "@mui/material";
import { BookingCard } from "../BookingCard/BookingCard";
import { useTheme } from "@mui/material/styles";

export interface BookingHistoryProps {
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }[];
}

export const BookingHistory = ({ data }: BookingHistoryProps) => {
  const theme = useTheme();
  return (
    <Box mt={2}>
      {data.map((booking) => (
        <Box key={booking.id}>
          <BookingCard {...booking} />
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};
