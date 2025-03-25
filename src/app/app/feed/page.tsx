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

// Define the User type
interface User {
  name: string;
  email: string;
  avatar: string;
  description: string;
  interests: string[];
}

const getRandomName = (index: number): string => {
  const names = [
    "Alexa Rawles",
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Davis",
    "Sophia Williams",
    "James Brown",
    "David Wilson",
    "Lily Taylor",
    "Matthew Moore",
    "Olivia Jackson",
    "Ethan Thomas",
    "Ava Lee",
    "Isabella Harris",
    "Lucas Clark",
    "Mason Lewis",
    "Mia Robinson",
    "Zoe Walker",
    "Liam Perez",
    "Charlotte Scott",
  ];
  return names[index % names.length];
};

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

// 3 random interests for each user
const getRandomInterests = (): string[] => {
  const shuffledInterests = [...interestsList].sort(() => Math.random() - 0.5);
  return shuffledInterests.slice(0, 3);
};

// random names, emails, and descriptions
const users: User[] = Array.from({ length: 20 }, (_, i) => {
  const name = getRandomName(i);
  return {
    name,
    email: `${name.replace(/ /g, "").toLowerCase()}@gmail.com`,
    avatar: `https://picsum.photos/seed/${i}/200`,
    description: `Hello! I am ${name}.`,
    interests: getRandomInterests(),
  };
});

// Define UserCard
interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps): JSX.Element => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            {user.email}
          </Typography>
          <Box
            mt={1}
            display="flex"
            gap={1}
            flexWrap="wrap"
            sx={{
              padding: 1,
            }}
          >
            {user.interests.length > 0 ? (
              user.interests.map((interest: string, index: number) => (
                <Chip
                  key={index}
                  label={interest}
                  variant="outlined"
                  sx={{
                    color: "black",
                    backgroundColor: "lightgray",
                  }}
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
        {user.description}
      </Typography>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="secondary">
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
  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const searchInputRef = useRef<HTMLInputElement>(null); // Create ref for the search input
  const popperRef = useRef<HTMLDivElement>(null); // Reference for the Popper component

  // Close if click outside
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setOpenSearchPopup(true);
  };

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.includes(interest)
        ? prevSelected.filter((item) => item !== interest)
        : [...prevSelected, interest],
    );
  };

  // Filter users with interests and search
  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedInterests.length === 0) {
      return matchesSearchQuery; // no interests -> match the search query
    }

    // Check if user interests intersect with selected interests
    const matchesInterests = selectedInterests.every((interest) =>
      user.interests.includes(interest),
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
        <Box
          sx={{
            color: "white",
            borderRadius: "15px 15px 0 0",
            outline: "1.5px solid #7C606B",
            width: "100%",
            height: "100px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight={600} color="secondary">
            BuddyRental Feed
          </Typography>
          <Box sx={{ position: "relative" }}>
            <Input
              ref={searchInputRef} // Attach the ref to the input
              placeholder="Search"
              value={searchQuery} // Bind the search query state
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
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
              onFocus={handleFocus} // Show search filter popup on focus
            />
            <Popper
              open={openSearchPopup}
              anchorEl={searchInputRef.current} // Anchor Popper to the search input ref
              placement="bottom-start"
              sx={{ zIndex: 1 }}
              ref={popperRef} // Attach the popper ref
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
                        selectedInterests.includes(interest)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => handleInterestChange(interest)}
                      sx={{ margin: "4px" }}
                    />
                  ))}
                </Box>
              </Card>
            </Popper>
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={3}
          alignItems="start"
          mt={2}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User, index: number) => (
              <UserCard key={index} user={user} />
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
