import { useEffect, useState } from "react";
import {
  Stack,
  Avatar,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  useTheme,
  Container,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReportData } from "@/api/report/interface";
import { User } from "@/model/user";
import { getUser } from "@/api/users/api";
import { getBuddy } from "@/api/buddy/api";

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

const ReportCategoryMap: Record<string, string> = {
  "25d40017-05ad-498b-bfcf-88632cff85d9": "Payment Issues",
  "123e4567-e89b-12d3-a456-426614174000": "Buddy/Customer Report",
  "cebae3c6-4ba6-4747-b351-325eb000243c": "App/System Issues",
  "6fb1dfaf-d12e-4ce7-a392-f5d83d91a46e": "Others",
};

export const ResolvedCard = (data: ReportData) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [action, setAction] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [buddy, setBuddy] = useState<User>();
  const [buddyId, setBuddyId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUser(data.userId);
        setUser(userRes);

        const buddyRes = await getBuddy({ buddyId });
        if (buddyRes?.userId) {
          const buddyUserRes = await getUser(buddyRes.userId);
          setBuddy(buddyUserRes);
        } else {
          console.warn(`No buddy found for buddyId: ${buddyId}`);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={bookingData[0].avatar} alt={user?.displayName} />
          <Box>
            <Typography variant="body1" fontWeight={600} color="primary">
              {user?.displayName}
            </Typography>
            <Typography variant="body2" color="secondary">
              {user?.email}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                label={ReportCategoryMap[data.categoryId]}
                color="primary"
              />
              <Typography variant="body2" color="text.secondary">
                {data.details}
              </Typography>
            </Box>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3 }}
          onClick={() => setOpen(true)}
        >
          Resolve
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#C76CA8", mb: 2 }}
            >
              Resolve Buddy/customer Report
            </Typography>

            <Box sx={{ border: "1px solid #E4A4B7", borderRadius: 2, p: 2 }}>
              <Typography fontWeight="bold" color="#C76CA8">
                Reported Account
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Avatar
                  src={bookingData[1].avatar}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography fontWeight="bold">
                    {buddy?.displayName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {buddy?.email}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                {data.details}
              </Typography>
            </Box>

            <RadioGroup
              value={action}
              onChange={(e) => setAction(e.target.value)}
              sx={{ mt: 2, display: "flex", flexDirection: "column" }}
            >
              {[
                { value: "10days", label: "Suspend for 10 Days" },
                { value: "1month", label: "Suspend for 1 Month" },
                { value: "3months", label: "Suspend for 3 Months" },
                { value: "ban", label: "Ban the Account" },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: "#E4A4B7",
                        "&.Mui-checked": { color: "#E4A4B7" },
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </RadioGroup>

            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#E4A4B7",
                  color: "white",
                  mt: 3,
                  width: "50%",
                  borderRadius: 2,
                }}
              >
                Resolve
              </Button>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};
