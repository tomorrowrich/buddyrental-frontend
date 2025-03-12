import { verifyUser } from "@/api/verify/api";
import { User } from "@/model/user";
import { Check } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import VerificationRejectDialog from "../VerificationRejectDialog/VerificationRejectDialog";

export const VerficationCard = (user: User & { onChange: () => void }) => {
  const [open, setOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const { onChange } = user;

  const name = user.firstName + " " + user.lastName;
  const avatar = user.profilePicture;
  const { email, citizenId, phoneNumber, address, interests } = user;

  const handleAccept = async () => {
    console.log("Accept", user.userId);
    const res = await verifyUser(true, user.userId);
    console.log(res);
    setOpen(false);
    if (res.success) {
      onChange();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={avatar} alt={name} />
          <Box>
            <Typography variant="body1" fontWeight={600} color="primary">
              {name}
            </Typography>
            <Typography variant="body2" color="secondary">
              {email}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3 }}
          onClick={() => setOpen(true)}
        >
          Details
        </Button>
      </Box>

      {/* Modal Dialog */}
      <VerificationRejectDialog
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          onChange();
        }}
        user={{ userId: user.userId, name }}
      />
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="end" alignItems="center">
            <IconButton
              aria-label="close-button"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Grid2
              size={{ sm: 4, md: 12 }}
              container
              spacing={2}
              alignItems="center"
            >
              <Grid2 size={5} alignItems={"center"} alignContent={"center"}>
                <Avatar
                  src={avatar}
                  alt={name}
                  sx={{
                    width: "80%",
                    maxWidth: "200px",
                    height: "auto",
                    aspectRatio: "1/1",
                  }}
                />
              </Grid2>
              <Grid2 size={7}>
                <Stack direction="column" spacing={2}>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography variant="h6" fontWeight={600}>
                      {name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="secondary">
                    {email}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    {interests?.map((interest) => (
                      <Chip key={interest} label={interest} />
                    ))}
                  </Stack>
                </Stack>
              </Grid2>
            </Grid2>

            <Box mb={4} mt={2}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Identity Card Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{citizenId}</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Phone Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{phoneNumber}</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Address
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">{address}</Typography>
                </Grid2>
              </Grid2>
            </Box>

            <Stack
              direction="row"
              justifyContent="center"
              spacing={4}
              mt={3}
              mb={2}
            >
              <Button
                variant="outlined"
                color="primary"
                endIcon={<CloseIcon />}
                onClick={() => {
                  setOpen(false);
                  setRejectOpen(true);
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="secondary"
                endIcon={<Check />}
                onClick={handleAccept}
              >
                Approve
              </Button>
            </Stack>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};
