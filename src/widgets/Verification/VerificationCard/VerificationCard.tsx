import { useState } from "react";
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
  Grid2,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Check } from "@mui/icons-material";
import VerificationRejectDialog from "../VerificationRejectDialog/VerificationRejectDialog";

export const VerficationCard = ({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) => {
  const [open, setOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);

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
        onClose={() => setRejectOpen(false)}
        name={name}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="end" alignItems="center">
            <IconButton data-testid="CloseIcon" onClick={() => setOpen(false)}>
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
                    <Chip label="Chip" color="default" />
                    <Chip label="Chip" color="default" />
                    <Chip label="Chip" color="default" />
                    <Chip label="Chip" color="default" />
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
                  <Typography variant="body2">X-XXXX-XXXXX-XX-X</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Phone Number
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">XXX-XXX-XXXX</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Address
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    Address Address Address Address Address Address Address
                  </Typography>
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
                onClick={() => setOpen(false)}
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
