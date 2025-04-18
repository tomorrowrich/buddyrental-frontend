import { Box, Avatar, Typography, Stack, Chip } from "@mui/material";
import { ReportData } from "@/api/report/interface";
import { User } from "@/model/user";
import { useEffect, useState } from "react";
import { getUser } from "@/api/users/api";

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

// HistoryReportCard Component
export const HistoryReportCard = ({ data }: { data: ReportData }) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user and buddy details from the backend
        const userRes = await getUser(data.userId);
        setUser(userRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [data.userId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 2,
        borderRadius: 2,
        boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
        mb: 3,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Avatar and user details */}
        <Avatar src={user?.profilePicture} alt={user?.displayName} />
        <Box>
          <Typography variant="body1" fontWeight={600} color="primary">
            {user?.displayName || "Unknown User"}
          </Typography>
          <Typography variant="body2" color="secondary">
            {user?.email || "No email"}
          </Typography>
          {/* Report Category and Details */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Chip label={ReportCategoryMap[data.categoryId]} color="primary" />
            <Typography variant="body2" color="text.secondary">
              {data.details || "No details provided."}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
