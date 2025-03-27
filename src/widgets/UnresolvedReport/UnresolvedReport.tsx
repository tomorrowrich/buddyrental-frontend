import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResolvedCard } from "../ResolvedCard/ResolvedCard";
import { ReportData } from "@/api/report/interface";

export interface ReportDataProps {
  datas: ReportData[];
}

export const UnresolvedReport = ({ datas }: ReportDataProps) => {
  const theme = useTheme();
  return (
    <Box mt={2}>
      {(Array.isArray(datas) ? datas : []).map((data) => (
        <Box key={data.id}>
          <ResolvedCard {...data} />
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};
