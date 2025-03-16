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
  useTheme,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/context/auth/auth";
import { updateProfile } from "@/api/users/api";
import { User } from "@/model/user";

export default function PersonalProfile() {
  const { user: authUser } = useAuth();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [registerBuddyStep, setRegisterBuddyStep] = useState(0); //State to control register buddy flow
  const [acceptedTerms, setAcceptedTerms] = useState(false); //buddy flow state for ToC acceptance, resets on close
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
          <Avatar
            src={user.profilePicture ? user.profilePicture : undefined}
            sx={{ width: 80, height: 80 }}
          >
            {!user.profilePicture && `${user.firstName.at(0)}`}
          </Avatar>
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
                  onClick={() => setRegisterBuddyStep(1)}
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

      {/* Step 1: Accept Terms and Conditions */}
      <Dialog
        open={registerBuddyStep === 1}
        onClose={() => {
          setRegisterBuddyStep(0);
          setAcceptedTerms(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Typography fontSize={16} mb={1}>
          Are you sure you want to become buddy?
        </Typography>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          Terms and Conditions
          <IconButton
            onClick={() => {
              setRegisterBuddyStep(0);
              setAcceptedTerms(false);
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            gap={2}
            mt={3}
            sx={{ color: theme.palette.quaternary.main }}
          >
            <Typography sx={{ color: theme.palette.secondary.main }}>
              A Terms and Conditions agreement acts as a legal contract between
              you (the company) and the user. It&apos;s where you maintain your
              rights to exclude users from your app in the event that they abuse
              your website/app, set out the rules for using your service and
              note other important details and disclaimers. Having a Terms and
              Conditions agreement is completely optional. No laws require you
              to have one. Not even the super-strict and wide-reaching General
              Data Protection Regulation (GDPR). Your Terms and Conditions
              agreement will be uniquely yours. While some clauses are standard
              and commonly seen in pretty much every Terms and Conditions
              agreement, it&apos;s up to you to set the rules and guidelines
              that the user must agree to. A Terms and Conditions agreement acts
              as a legal contract between you (the company) and the user.
              It&apos;s where you maintain your rights to
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  name="terms"
                />
              }
              label="I agree to all the Terms and Privacy Policies"
            />
          </FormGroup>
          <Button
            disabled={!acceptedTerms}
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
            onClick={() => {
              setRegisterBuddyStep(2);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step 2: Enter buddy information */}
      <Dialog
        open={registerBuddyStep === 2}
        onClose={() => {
          setRegisterBuddyStep(0);
          setAcceptedTerms(false);
        }}
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
          <IconButton
            onClick={() => {
              setRegisterBuddyStep(0);
              setAcceptedTerms(false);
            }}
            size="small"
          >
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
            onClick={() => {
              setRegisterBuddyStep(3);
            }} //TODO: make this actually register the buddy
          >
            Finish !
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={registerBuddyStep === 3}
        onClose={() => {
          setRegisterBuddyStep(0);
          setAcceptedTerms(false);
        }}
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
          Welcome to the Team, New Buddy!
          <IconButton
            onClick={() => {
              setRegisterBuddyStep(0);
              setAcceptedTerms(false);
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography
            fontSize={14}
            fontWeight="bold"
            mb={1}
            sx={{ color: theme.palette.secondary.main }}
          >
            A big welcome to our newest buddy! We&apos;re so glad you&apos;re
            here and can&apos;t wait to see the positive energy you&apos;ll
            bring!
          </Typography>
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
            onClick={() => {
              setRegisterBuddyStep(0);
              setAcceptedTerms(false);
            }}
          >
            Yeah !
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
