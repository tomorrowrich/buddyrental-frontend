"use client";
import { VerificationRequest } from "@/widgets/Verification/VerificationHistory/VerificationHistory";
import { Box, Container, Typography, useTheme } from "@mui/material";

// TODO Fetch real verification data from API
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
  {
    id: 11,
    name: "Patricia Lee",
    email: "plee@gmail.com",
    avatar: "https://picsum.photos/200?random=11",
  },
  {
    id: 12,
    name: "Thomas Martin",
    email: "tmartin@gmail.com",
    avatar: "https://picsum.photos/200?random=12",
  },
  {
    id: 13,
    name: "Sandra White",
    email: "swhite@gmail.com",
    avatar: "https://picsum.photos/200?random=13",
  },
  {
    id: 14,
    name: "Kevin Moore",
    email: "kmoore@gmail.com",
    avatar: "https://picsum.photos/200?random=14",
  },
  {
    id: 15,
    name: "Nancy Davis",
    email: "ndavis@gmail.com",
    avatar: "https://picsum.photos/200?random=15",
  },
  {
    id: 16,
    name: "Daniel Miller",
    email: "dmiller@gmail.com",
    avatar: "https://picsum.photos/200?random=16",
  },
  {
    id: 17,
    name: "Elizabeth Clark",
    email: "eclark@gmail.com",
    avatar: "https://picsum.photos/200?random=17",
  },
  {
    id: 18,
    name: "Richard Hall",
    email: "rhall@gmail.com",
    avatar: "https://picsum.photos/200?random=18",
  },
  {
    id: 19,
    name: "Jennifer Young",
    email: "jyoung@gmail.com",
    avatar: "https://picsum.photos/200?random=19",
  },
  {
    id: 20,
    name: "William King",
    email: "wking@gmail.com",
    avatar: "https://picsum.photos/200?random=20",
  },
];

export default function Page() {
  const theme = useTheme();
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
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.tertiary.main} , ${theme.palette.quinary.main})`,
            padding: 2,
            color: "white",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          Verification Management
        </Typography>
        <Box
          data-testid="booking-history-container"
          sx={{ width: "100%", padding: 2, flex: 1 }}
        >
          <VerificationRequest data={bookingData} />
        </Box>
      </Box>
    </Container>
  );
}
