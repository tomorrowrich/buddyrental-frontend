"use client";

import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Card,
  InputAdornment,
  Input,
  Popper,
  Fade,
  Rating,
  Divider,
} from "@mui/material";
import { useState, useRef, useEffect, JSX } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { fetchBuddies } from "@/api/buddies/api";
import { useRouter } from "next/navigation"; // นำเข้า useRouter
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";

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
    router.push(`/buddy/${buddy.buddyId}`); // นำทางไปยังหน้ารายละเอียดของ Buddy
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      }}
    >
      <Card
        onClick={handleDetailsClick}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0px 10px 25px rgba(124, 96, 107, 0.35)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 15px 30px rgba(124, 96, 107, 0.5)",
            cursor: "pointer",
          },
          background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
        }}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            src={buddy.user.profilePicture || ""}
            sx={{
              width: 64,
              height: 64,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              border: "3px solid #fff",
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              {buddy.user.displayName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
              <Rating
                value={buddy.ratingAvg}
                readOnly
                precision={0.5}
                size="small"
                emptyIcon={
                  <StarIcon style={{ opacity: 0.3 }} fontSize="small" />
                }
              />
              <Typography variant="body2" color="text.secondary">
                ({buddy.totalReviews} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <LocalOfferIcon fontSize="small" color="secondary" />
          <Typography variant="subtitle2" fontWeight={600}>
            Interests
          </Typography>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 3 }}>
          {buddy.tags.length > 0 ? (
            buddy.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.name}
                variant="outlined"
                size="small"
                sx={{
                  color: "#5D4954",
                  backgroundColor: "rgba(124, 96, 107, 0.08)",
                  fontWeight: 500,
                  borderRadius: "16px",
                  "&:hover": {
                    backgroundColor: "rgba(124, 96, 107, 0.15)",
                  },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No interests listed
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            color: "#555",
            lineHeight: 1.6,
            fontStyle: "italic",
            backgroundColor: "rgba(249, 249, 249, 0.7)",
            p: 2,
            borderRadius: 2,
            whiteSpace: "pre-line",
          }}
        >
          <Typography variant="body2">
            {buddy.description || "No description available"}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default function Feed(): JSX.Element {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBuddies = async () => {
      const response = await fetchBuddies();
      if (response.success) {
        setBuddies(response.data || []);
      } else {
        console.error(response.error);
      }
      setIsLoading(false);
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
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 8,
          p: { xs: 3, md: 5 },
          boxShadow: "0px 10px 30px rgba(124, 96, 107, 0.15)",
          border: "1.5px solid rgba(124, 96, 107, 0.2)",
          position: "relative",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="secondary"
          sx={{
            mb: 4,
            textAlign: "center",
            backgroundImage: "linear-gradient(45deg, #7C606B, #5D4954)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          BuddyRental Feed
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 4,
            alignItems: "center",
            top: 0,
            zIndex: 5,
            pt: 2,
            pb: 2,
            bgcolor: "white",
          }}
        >
          <Box
            sx={{ position: "relative", width: { xs: "100%", sm: "600px" } }}
          >
            <Input
              ref={searchInputRef}
              placeholder="Search for buddies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "100%",
                borderRadius: "30px",
                padding: "15px 20px",
                border: "2px solid rgba(124, 96, 107, 0.2)",
                transition: "all 0.3s ease",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  border: "2px solid rgba(124, 96, 107, 0.4)",
                  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)",
                },
                "&:focus": {
                  border: "2px solid #7C606B",
                },
              }}
              disableUnderline
              endAdornment={
                <InputAdornment position="end">
                  <Box
                    sx={{
                      backgroundColor: "#7C606B",
                      borderRadius: "50%",
                      width: 38,
                      height: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <SearchIcon sx={{ color: "white" }} />
                  </Box>
                </InputAdornment>
              }
              onFocus={handleFocus}
            />
          </Box>

          <Popper
            open={openSearchPopup}
            anchorEl={searchInputRef.current}
            placement="bottom-start"
            sx={{ zIndex: 10 }}
            ref={popperRef}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Card
                  sx={{
                    width: { xs: "100%", sm: "600px" },
                    borderRadius: "20px",
                    padding: "20px",
                    mt: 1,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(124, 96, 107, 0.2)",
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Filter by Interests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {interestsList.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        clickable
                        color={
                          selectedInterests.includes(interest)
                            ? "secondary"
                            : "default"
                        }
                        onClick={() => handleInterestChange(interest)}
                        sx={{
                          margin: "4px",
                          borderRadius: "20px",
                          fontWeight: 500,
                          px: 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Card>
              </Fade>
            )}
          </Popper>

          {selectedInterests.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Active Filters:
              </Typography>
              {selectedInterests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  color="secondary"
                  size="small"
                  onDelete={() => handleInterestChange(interest)}
                  sx={{ borderRadius: "20px" }}
                />
              ))}
            </Box>
          )}
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading buddies...
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              columnCount: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
              columnGap: 4,
            }}
          >
            {filteredBuddies.length > 0 ? (
              filteredBuddies.map((user, index) => (
                <Box key={index} sx={{ mb: 4, breakInside: "avoid" }}>
                  <UserCard buddy={user} />
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  columnSpan: "all",
                  textAlign: "center",
                  py: 6,
                  backgroundColor: "rgba(249, 249, 249, 0.5)",
                  borderRadius: 4,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No buddies found matching your criteria.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Try adjusting your search or filters.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
