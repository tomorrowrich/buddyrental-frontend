"use client";

import {
  Box,
  Container,
  Typography,
  useTheme,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";

// Define issue types and their descriptions
const issueTags = [
  "Payment issue",
  "App/system issues",
  "Buddy/Customer Report",
] as const;
type IssueTag = (typeof issueTags)[number];

const issueDescriptions: Record<IssueTag, string> = {
  "Payment issue": "xxxxx.issue",
  "App/system issues": "xxxxx. issue",
  "Buddy/Customer Report": "xxxxx. issue",
};

// Function to get a random issue tag and description
const getRandomIssue = (): { issueTag: IssueTag; issueDescription: string } => {
  const tag = issueTags[Math.floor(Math.random() * issueTags.length)];
  return { issueTag: tag, issueDescription: issueDescriptions[tag] };
};

// Define the user type including the issue tag and description
interface SuspendedUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  mockTime: number;
  issueTag: IssueTag;
  issueDescription: string;
}

// SuspendData component to display suspended users
const SuspendData = ({ data }: { data: SuspendedUser[] }) => {
  const theme = useTheme();

  return (
    <Box mt={2}>
      {data.map((account) => (
        <Box key={account.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={account.avatar} alt={account.name} />
              <Box>
                <Typography variant="body1" fontWeight={600} color="primary">
                  {account.name}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {account.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "secondary.main",
                    color: "white",
                    paddingX: 1,
                    paddingY: 0.5,
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                >
                  {account.issueTag}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {account.issueDescription}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Divider
            sx={{ background: theme.palette.quinary.main }}
            variant="middle"
          />
        </Box>
      ))}
    </Box>
  );
};

// Main Page Component
export default function SuspendAccount() {
  const theme = useTheme();

  // List of suspended users
  const suspendData: SuspendedUser[] = [
    {
      id: 1,
      name: "Alexa Rawles",
      email: "alexarawles@gmail.com",
      avatar: "https://picsum.photos/200?random=1",
      mockTime: 5 * 24 * 60 * 60,
    },
    {
      id: 2,
      name: "John Smith",
      email: "johnsmith@gmail.com",
      avatar: "https://picsum.photos/200?random=2",
      mockTime: 10 * 24 * 60 * 60,
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emmaw@gmail.com",
      avatar: "https://picsum.photos/200?random=3",
      mockTime: 2 * 30 * 24 * 60 * 60,
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "mchen@gmail.com",
      avatar: "https://picsum.photos/200?random=4",
      mockTime: 0,
    },
    {
      id: 5,
      name: "Sarah Johnson",
      email: "sarahj@gmail.com",
      avatar: "https://picsum.photos/200?random=5",
      mockTime: 15 * 24 * 60 * 60,
    },
    {
      id: 6,
      name: "David Brown",
      email: "dbrown@gmail.com",
      avatar: "https://picsum.photos/200?random=6",
      mockTime: 0,
    },
    {
      id: 7,
      name: "Lisa Anderson",
      email: "landerson@gmail.com",
      avatar: "https://picsum.photos/200?random=7",
      mockTime: 7 * 24 * 60 * 60,
    },
    {
      id: 8,
      name: "James Wilson",
      email: "jwilson@gmail.com",
      avatar: "https://picsum.photos/200?random=8",
      mockTime: 3 * 30 * 24 * 60 * 60,
    },
    {
      id: 9,
      name: "Maria Garcia",
      email: "mgarcia@gmail.com",
      avatar: "https://picsum.photos/200?random=9",
      mockTime: 1 * 30 * 24 * 60 * 60,
    },
    {
      id: 10,
      name: "Robert Taylor",
      email: "rtaylor@gmail.com",
      avatar: "https://picsum.photos/200?random=10",
      mockTime: 2 * 24 * 60 * 60,
    },
    {
      id: 11,
      name: "Patricia Lee",
      email: "plee@gmail.com",
      avatar: "https://picsum.photos/200?random=11",
      mockTime: 3 * 24 * 60 * 60,
    },
    {
      id: 12,
      name: "Thomas Martin",
      email: "tmartin@gmail.com",
      avatar: "https://picsum.photos/200?random=12",
      mockTime: 0,
    },
    {
      id: 13,
      name: "Sandra White",
      email: "swhite@gmail.com",
      avatar: "https://picsum.photos/200?random=13",
      mockTime: 10 * 24 * 60 * 60,
    },
    {
      id: 14,
      name: "Kevin Moore",
      email: "kmoore@gmail.com",
      avatar: "https://picsum.photos/200?random=14",
      mockTime: 1 * 30 * 24 * 60 * 60,
    },
    {
      id: 15,
      name: "Nancy Davis",
      email: "ndavis@gmail.com",
      avatar: "https://picsum.photos/200?random=15",
      mockTime: 8 * 24 * 60 * 60,
    },
    {
      id: 16,
      name: "Daniel Miller",
      email: "dmiller@gmail.com",
      avatar: "https://picsum.photos/200?random=16",
      mockTime: 20 * 24 * 60 * 60,
    },
    {
      id: 17,
      name: "Elizabeth Clark",
      email: "eclark@gmail.com",
      avatar: "https://picsum.photos/200?random=17",
      mockTime: 0,
    },
    {
      id: 18,
      name: "Richard Hall",
      email: "rhall@gmail.com",
      avatar: "https://picsum.photos/200?random=18",
      mockTime: 6 * 24 * 60 * 60,
    },
    {
      id: 19,
      name: "Jennifer Young",
      email: "jyoung@gmail.com",
      avatar: "https://picsum.photos/200?random=19",
      mockTime: 4 * 30 * 24 * 60 * 60,
    },
    {
      id: 20,
      name: "William King",
      email: "wking@gmail.com",
      avatar: "https://picsum.photos/200?random=20",
      mockTime: 9 * 24 * 60 * 60,
    },
  ].map((user) => ({ ...user, ...getRandomIssue() })); // Assign random issue tags

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
          <SuspendData data={suspendData} />
        </Box>
      </Box>
    </Container>
  );
}
