"use client";
import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type User = {
  firstName: string;
  lastName: string;
  nickname: string;
  dateOfBirth: string;
  email: string;
  gender: string;
  phone: string;
  idNumber: string;
  address: string;
  city: string;
  zip: string;
  interests: string[];
  avatar: string;
};
export default function PersonalProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>({
    firstName: "Alexa",
    lastName: "Rawles",
    nickname: "Alexa",
    dateOfBirth: "2004-05-19",
    email: "alexarawles@gmail.com",
    gender: "Woman",
    phone: "XXX-XXX-XXXX",
    idNumber: "X-XXXX-XXXXX-XX-X",
    address: "123 Main Street",
    city: "Bangkok",
    zip: "10110",
    interests: ["Music", "Travel", "Technology"],
    avatar: "https://picsum.photos/200",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Container sx={{ py: "0px" }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #EB7BC0, #EED5C2)",
            borderRadius: "16px 16px 0 0",
            width: "100%",
            height: "100px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            color: "white",
            position: "absolute",
            top: "40px",
            left: "20px",
            px: 2,
          }}
        >
          Personal Profile
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mt={12}>
          <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
          <Box flexGrow={1}>
            <Typography variant="h5" fontWeight={500}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Chip
                label="Customer"
                size="small"
                sx={{
                  bgcolor: "#EDA4BD",
                  color: "white",
                }}
              />
              {!isEditing && (
                <Typography variant="body1" fontSize="12px" color="#EB7BC0">
                  <span style={{ textDecoration: "underline" }}>
                    want to become a buddy ? click here !
                  </span>
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ position: "absolute", top: 140, right: 30 }}>
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#EB7BC0",
                color: "white",
                textTransform: "none",
                boxShadow: "none",
              }}
              onClick={() => setIsEditing(false)}
            >
              Save Change
            </Button>
          )}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          gap={2}
          mt={4}
        >
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Nickname", name: "nickname" }, // Add Nickname field
            { label: "Email", name: "email" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Gender", name: "gender" },
            { label: "Phone Number", name: "phone" },
            { label: "Identity Card Number", name: "idNumber" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "ZIP Code", name: "zip" },
          ].map(({ label, name, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              type={type || "text"} // Set the type for the date field
              value={user[name as keyof User]}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
          ))}
        </Box>

        <Typography variant="body1" fontSize="14px" fontWeight={500} mt={4}>
          Interests
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {user.interests.map((interest, index) => (
            <Chip key={index} label={interest} variant="outlined" />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
