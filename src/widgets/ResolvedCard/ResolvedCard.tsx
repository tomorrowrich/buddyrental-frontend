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
import {
  resolveReport,
  setBan,
  setSuspendTime,
  getCategories,
} from "@/api/report/api";

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
    const fetchCategories = async () => {
      const res: CategoriesResponse[] = await getCategories({
        take: 100,
        skip: 0,
      });

      const ReportCategoryMap: Record<string, string> = res.data.data.reduce(
        (map, category) => {
          map[category.id] = category.name;
          return map;
        },
        {} as Record<string, string>,
      );
      setReportCategoryMap(ReportCategoryMap);
    };

    fetchCategories();
  }, []);

  const [ReportCategoryMap, setReportCategoryMap] = useState<
    Record<string, string>
  >({});

  const getCategoryId = (categoryName: string): string => {
    return reportCategoryMap[categoryName];
  };

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
    if (
      !action &&
      ReportCategoryMap[data.categoryId] === "Buddy Host Complaints"
    ) {
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
                {ReportCategoryMap[data.categoryId] ===
                  "Buddy Host Complaints" && "Reported Account"}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {ReportCategoryMap[data.categoryId] ===
                  "Buddy Host Complaints" && (
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

            {ReportCategoryMap[data.categoryId] === "Buddy Host Complaints" && (
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
