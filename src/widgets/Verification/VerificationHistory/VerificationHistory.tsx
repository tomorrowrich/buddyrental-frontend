import { Box, Divider } from "@mui/material";
import { VerficationCard } from "../VerificationCard/VerificationCard";
import { useTheme } from "@mui/material/styles";

export interface VerificationRequestProps {
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }[];
}

export const VerificationRequest = ({ data }: VerificationRequestProps) => {
  const theme = useTheme();
  return (
    <Box mt={2}>
      {data.map((booking) => (
        <Box key={booking.id}>
          <VerficationCard {...booking} />
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};
