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
import { resolveReport, setBan, setSuspendTime } from "@/api/report/api";

const ReportCategoryMap: Record<string, string> = {
  "25d40017-05ad-498b-bfcf-88632cff85d9": "Payment Issues",
  "28b62f4e-82b1-4ad1-b337-ac00e792a214": "Buddy/Customer Report",
  "2a210419-bedc-4f61-86ca-53c6459e20b8": "Search/Filter Problems",
  "4430c74b-f39c-4190-8332-326e1edda5f7": "Account Issues",
  "4bdc2786-38bf-4d48-8e38-f57658da5ec3": "Feedback & Suggestions",
  "4fcad569-38a9-43f9-b629-b3bce0ef526f": "Rental Experience",
  "6a2439f1-33a5-4a62-82fc-6468ed2237b3": "UI/UX Issues",
  "6fb1dfaf-d12e-4ce7-a392-f5d83d91a46e": "Others",
  "85cd6225-8333-4b0d-9ea7-0b7d9c0454cf": "Safety Concerns",
  "a902287f-d65a-439d-ac10-eb981c57412d": "Verification Problems",
  "b474cc8e-9a6d-402f-a56c-1659c149aa19": "Feature Requests",
  "cc27c907-80d3-4813-8a71-fa4e3141768a": "Notification Issues",
  "cebae3c6-4ba6-4747-b351-325eb000243c": "App/System Issues",
  "e19abe05-3691-4e79-af60-a3d9e76c959d": "Booking Process Errors",
};

export const ResolvedCard = ({
  data,
  onResolved,
}: {
  data: ReportData;
  onResolved?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [user, setUser] = useState<User>();
  const [buddy, setBuddy] = useState<User>();
  const [buddyId, setBuddyId] = useState<string>("");
  const [action, setAction] = useState<
    "10days" | "1month" | "3months" | "ban" | "none" | ""
  >("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user and buddy details from the backend
        const userRes = await getUser(data.userId);
        setUser(userRes);

        if (data.buddyId) {
          const buddyRes = await getBuddy({ buddyId: data.buddyId });
          if (buddyRes?.userId) {
            const buddyUserRes = await getUser(buddyRes.userId);
            setBuddy(buddyUserRes);
          } else {
            console.warn(`No buddy found for buddyId: ${data.buddyId}`);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [data.userId, data.buddyId]);

  const handleResolveReport = async () => {
    if (!action && data.categoryId === "28b62f4e-82b1-4ad1-b337-ac00e792a214") {
      alert("Please select an action before resolving.");
      return;
    }

    try {
      let suspendTime: number | undefined;

      if (action === "10days") {
        suspendTime = 10;
      } else if (action === "1month") {
        suspendTime = 30;
      } else if (action === "3months") {
        suspendTime = 90;
      }

      if (suspendTime) {
        const result = await setSuspendTime(buddy?.userId, suspendTime);
        console.log("User suspended:", result);
      } else if (action === "ban") {
        const result = await setBan(buddy?.userId, true);
        console.log("User banned:", result);
      }

      const result = await resolveReport(
        data.id,
        "RESOLVED",
        action !== "none"
          ? (action as "10days" | "1month" | "3months" | "ban")
          : undefined,
      );

      console.log("Resolved report:", result);
      setOpen(false);
      onResolved?.();
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

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
          <Avatar src={user?.profilePicture} alt={user?.displayName} />
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
                {data.categoryId === "28b62f4e-82b1-4ad1-b337-ac00e792a214" &&
                  "Reported Account"}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {data.categoryId === "28b62f4e-82b1-4ad1-b337-ac00e792a214" && (
                  <Avatar
                    src={buddy?.profilePicture}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                )}
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

            {data.categoryId === "28b62f4e-82b1-4ad1-b337-ac00e792a214" && (
              <RadioGroup
                value={action}
                onChange={(e) =>
                  setAction(
                    e.target.value as "10days" | "1month" | "3months" | "ban",
                  )
                }
                sx={{ mt: 2, display: "flex", flexDirection: "column" }}
              >
                {[
                  { value: "10days", label: "Suspend for 10 Days" },
                  { value: "1month", label: "Suspend for 1 Month" },
                  { value: "3months", label: "Suspend for 3 Months" },
                  { value: "ban", label: "Ban the Account" },
                  { value: "none", label: "Do Nothing" },
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
            )}

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
                onClick={handleResolveReport}
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
