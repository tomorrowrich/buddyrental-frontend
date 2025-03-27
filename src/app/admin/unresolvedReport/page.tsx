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
import { useState } from "react";
import { useRouter } from "next/navigation";

const filters = [
  { label: "Payment Issue", value: "payment" },
  { label: "App/System Issue", value: "app_system" },
  { label: "Buddy/Customer Report", value: "buddy_customer" },
  { label: "Others", value: "others" },
];

// TODO Fetch real booking data from API
const bookingData = [
  {
    id: 1,
    name: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    avatar: "https://picsum.photos/200?random=1",
  },
  {
    id: 2,
    name: "John Smith",
    email: "johnsmith@gmail.com",
    avatar: "https://picsum.photos/200?random=2",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emmaw@gmail.com",
    avatar: "https://picsum.photos/200?random=3",
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "mchen@gmail.com",
    avatar: "https://picsum.photos/200?random=4",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "sarahj@gmail.com",
    avatar: "https://picsum.photos/200?random=5",
  },
  {
    id: 6,
    name: "David Brown",
    email: "dbrown@gmail.com",
    avatar: "https://picsum.photos/200?random=6",
  },
  {
    id: 7,
    name: "Lisa Anderson",
    email: "landerson@gmail.com",
    avatar: "https://picsum.photos/200?random=7",
  },
  {
    id: 8,
    name: "James Wilson",
    email: "jwilson@gmail.com",
    avatar: "https://picsum.photos/200?random=8",
  },
  {
    id: 9,
    name: "Maria Garcia",
    email: "mgarcia@gmail.com",
    avatar: "https://picsum.photos/200?random=9",
  },
  {
    id: 10,
    name: "Robert Taylor",
    email: "rtaylor@gmail.com",
    avatar: "https://picsum.photos/200?random=10",
  },
];

export default function Page() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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
          <UnresolvedReport data={bookingData} />
        </Box>
      </Box>
    </Container>
  );
}
