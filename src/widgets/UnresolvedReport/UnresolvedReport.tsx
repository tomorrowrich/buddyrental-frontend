import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResolvedCard } from "../ResolvedCard/ResolvedCard";

export interface BookingHistoryProps {
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }[];
}

export const UnresolvedReport = ({ data }: BookingHistoryProps) => {
  const theme = useTheme();
  return (
    <Box mt={2}>
      {data.map((booking) => (
        <Box key={booking.id}>
          <ResolvedCard {...booking} />
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};
