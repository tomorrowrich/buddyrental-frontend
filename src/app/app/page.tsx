"use client";

import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  InputAdornment,
  Input,
  Popper,
} from "@mui/material";
import { useState, useRef, useEffect, JSX } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { fetchBuddiesClient } from "@/api/buddies/api.client";
import { useRouter } from "next/navigation"; // นำเข้า useRouter

interface Buddy {
  buddyId: string;
  description: string;
  ratingAvg: number;
  totalReviews: number;
  priceMin: number;
  priceMax: number;
  tags: { tagId: string; name: string }[];
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    profilePicture: string | null;
  };
}

const interestsList = [
  "Music",
  "Travel",
  "Technology",
  "Sports",
  "Cooking",
  "Photography",
  "Gaming",
  "Reading",
];

const UserCard = ({ buddy }: { buddy: Buddy }): JSX.Element => {
  const router = useRouter(); // เรียกใช้งาน useRouter

  // ฟังก์ชันที่ใช้ในการนำทางไปยังหน้า buddyId
  const handleDetailsClick = () => {
    router.push(`/app/buddy/${buddy.buddyId}`); // นำทางไปยังหน้ารายละเอียดของ Buddy
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={buddy.user.profilePicture || "/default-avatar.png"}
          sx={{ width: 100, height: 100 }}
        />
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {buddy.user.displayName}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            {buddy.user.email}
          </Typography>
          <Box
            mt={1}
            display="flex"
            gap={1}
            flexWrap="wrap"
            sx={{ padding: 1 }}
          >
            {buddy.tags.length > 0 ? (
              buddy.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.name}
                  variant="outlined"
                  sx={{ color: "black", backgroundColor: "lightgray" }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No interests listed
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Typography mt={2} fontSize={14}>
        {buddy.description || "No description available"}
      </Typography>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDetailsClick}
        >
          Details
        </Button>
        <Button variant="contained" color="tertiary" sx={{ color: "white" }}>
          Book
        </Button>
      </Box>
    </Card>
  );
};

export default function Feed(): JSX.Element {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBuddies = async () => {
      const response = await fetchBuddiesClient();
      if (response.success) {
        setBuddies(response.data || []);
      } else {
        console.error(response.error);
      }
      setLoading(false);
    };
    loadBuddies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        popperRef.current &&
        !popperRef.current.contains(event.target as Node)
      ) {
        setOpenSearchPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => setOpenSearchPopup(true);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const filteredBuddies = buddies.filter((buddy) => {
    const matchesSearchQuery =
      buddy.user.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      buddy.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedInterests.length === 0) {
      return matchesSearchQuery;
    }

    const matchesInterests = selectedInterests.every((interest) =>
      buddy.tags.some(
        (tag) => tag.name.toLowerCase() === interest.toLowerCase(),
      ),
    );

    return matchesSearchQuery && matchesInterests;
  });

  return (
    <Container sx={{ py: 5 }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          border: "1.5px solid #7C606B",
          position: "relative",
        }}
      >
        <Typography variant="h4" fontWeight={600} color="secondary">
          BuddyRental Feed
        </Typography>

        <Input
          ref={searchInputRef}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "600px",
            borderRadius: "20px",
            padding: "12px",
            border: "1px solid black",
          }}
          disableUnderline
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "black" }} />
            </InputAdornment>
          }
          onFocus={handleFocus}
        />

        <Popper
          open={openSearchPopup}
          anchorEl={searchInputRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1 }}
          ref={popperRef}
        >
          <Card
            sx={{
              width: "600px",
              borderRadius: "20px",
              padding: "12px",
              mt: 1,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              border: "1px solid black",
            }}
          >
            <Typography variant="h6" mb={2}>
              Filter by Interests
            </Typography>
            <Box>
              {interestsList.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  clickable
                  color={
                    selectedInterests.includes(interest) ? "primary" : "default"
                  }
                  onClick={() => handleInterestChange(interest)}
                  sx={{ margin: "4px" }}
                />
              ))}
            </Box>
          </Card>
        </Popper>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={3}
          alignItems="start"
          mt={2}
        >
          {filteredBuddies.length > 0 ? (
            filteredBuddies.map((user, index) => (
              <UserCard key={index} buddy={user} />
            ))
          ) : (
            <Typography variant="h6" color="text.secondary">
              No users found.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
