"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/context/auth/auth";
import { updateProfile } from "@/api/users/api";
import { User } from "@/model/user";

export default function PersonalProfile() {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false); // State to control pop-up visibility

  const [user, setUser] = useState<User>({
    profilePicture: "https://picsum.photos/200",
  } as User);

  useEffect(() => {
    if (authUser) {
      setUser({ ...authUser, displayName: authUser.displayName || "" });
    }
  }, [authUser]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "dateOfBirth") value = new Date(value).toISOString();
    console.log(name, value);
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("Save", user);
    const resp = await updateProfile(user);
    console.log(resp);
    setIsEditing(false);
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
          <Avatar src={user.profilePicture} sx={{ width: 80, height: 80 }} />
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
                <Typography
                  variant="body1"
                  fontSize="12px"
                  color="#EB7BC0"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(true)}
                >
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
              onClick={handleSave}
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
            { label: "Nickname", name: "displayName" },
            { label: "Email", name: "email" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Gender", name: "gender" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Identity Card Number", name: "citizenId" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "ZIP Code", name: "postalCode" },
          ].map(({ label, name, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              type={type || "text"}
              value={
                name === "dateOfBirth"
                  ? user.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                    : ""
                  : user[name as keyof User] || ""
              }
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
          {user.interests?.map((interest, index) => (
            <Chip key={index} label={interest} variant="outlined" />
          ))}
        </Box>
      </Box>

      {/* Modal for pop-up card */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          Complete profile to Become Buddy
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={14} fontWeight="bold" mb={1}>
            Description
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder="Tell customers about yourself! This information will show up on your profile."
            fullWidth
          />

          <Box display="flex" gap={2} mt={3}>
            <Box flex={1}>
              <Typography fontSize={14} fontWeight="bold">
                Minimum Price / Day
              </Typography>
              <Select fullWidth defaultValue={0}>
                {[500, 1000, 1500, 2000].map((price) => (
                  <MenuItem key={price} value={price}>
                    {price}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box flex={1}>
              <Typography fontSize={14} fontWeight="bold">
                Maximum Price / Day
              </Typography>
              <Select fullWidth defaultValue={0}>
                {[1000, 1500, 2000, 2500].map((price) => (
                  <MenuItem key={price} value={price}>
                    {price}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#EB7BC0",
              color: "white",
              px: 4,
              fontWeight: "light",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { bgcolor: "#E67BA0" },
            }}
            onClick={() => setOpen(false)}
          >
            Finish !
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
