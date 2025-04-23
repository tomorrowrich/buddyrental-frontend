import { Box, Avatar, Typography, Stack, Chip } from "@mui/material";
import { ReportData } from "@/api/report/interface";
import { User } from "@/model/user";
import { useEffect, useState } from "react";
import { getUser } from "@/api/users/api";
import { getCategories } from "@/api/report/api";
import { CategoriesResponse } from "@/api/report/interface";

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

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories({
        take: 100,
        skip: 0,
      });

      console.log("Categories: ", res);
      const categories: CategoriesResponse[] = res.data.data;

      const ReportCategoryMap: Record<string, string> = categories.reduce(
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
