"use client";

import { UnresolvedReport } from "@/widgets/UnresolvedReport/UnresolvedReport";
import {
  Box,
  Container,
  Typography,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/report/api";
import { ReportData } from "@/api/report/interface";

const filters = [
  { label: "Payment Issue", value: "payment" },
  { label: "App/System Issue", value: "app_system" },
  { label: "Buddy/Customer Report", value: "buddy_customer" },
  { label: "Others", value: "others" },
];

export default function Page() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        throw err;
      }
    };

    fetchReports();
  }, []);

  console.log(reports);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(90deg, #f8a5c2 , #ffcccc)",
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="h5" fontWeight={700} color="white">
              Unresolved Report
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/history")}
            >
              History
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilterClick}
            >
              Filter Report
            </Button>
          </Box>
        </Box>

        {/* Filter Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
        >
          {filters.map((filter) => (
            <MenuItem
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
            >
              <FormControlLabel
                control={
                  <Checkbox checked={selectedFilters.includes(filter.value)} />
                }
                label={filter.label}
              />
            </MenuItem>
          ))}
        </Menu>

        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          <UnresolvedReport datas={reports} />
        </Box>
      </Box>
    </Container>
  );
}
