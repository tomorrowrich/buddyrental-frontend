"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import { getReports } from "@/api/report/api";
import { useEffect, useState } from "react";
import { ReportData } from "@/api/report/interface";
import { HistoryReportCard } from "@/widgets/HistoryReportCard/HistoryReportCard";

// Main Page Component
export default function ReportHistoryPage() {
  const theme = useTheme();
  const [reports, setReports] = useState<ReportData[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports("RESOLVED");
        setReports(data);
        console.log("reports: ", data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  return (
    <Container sx={{ flex: 1, paddingTop: 5, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
          mb: 10,
          borderRadius: 2,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main}, ${theme.palette.quinary.main})`,
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          History Report
        </Typography>
        <Box sx={{ width: "100%", padding: 2, flex: 1 }}>
          {reports.map((data) => {
            // หา user ที่ตรงกับ report.userId
            return <HistoryReportCard key={data.id} data={data} />;
          })}
        </Box>
      </Box>
    </Container>
  );
}
