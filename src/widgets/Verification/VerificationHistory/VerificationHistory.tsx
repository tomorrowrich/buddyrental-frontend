import { Box, Divider } from "@mui/material";
import { VerficationCard } from "../VerificationCard/VerificationCard";
import { useTheme } from "@mui/material/styles";
import { User } from "@/model/user";

export interface VerificationRequestProps {
  data: User[];
  onChange: () => void;
}

export const VerificationRequest = ({
  data,
  onChange,
}: VerificationRequestProps) => {
  const theme = useTheme();
  return (
    <Box mt={2}>
      {data?.map((user) => (
        <Box key={user.userId}>
          <VerficationCard {...user} onChange={onChange} />
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};
