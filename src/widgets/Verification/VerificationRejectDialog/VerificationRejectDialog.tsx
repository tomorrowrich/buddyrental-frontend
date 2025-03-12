import { verifyUser } from "@/api/verify/api";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const reasonsList = [
  "Inaccurate Information",
  "Suspicious Profile",
  "Violating Platform Guidelines",
  "Safety & Security Concerns",
  "Missing required fields",
];

const VerificationRejectDialog = ({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: {
    userId: string;
    name: string;
  };
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [extraReason, setExtraReason] = useState("");

  const { userId, name } = user;

  const handleToggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
  };

  const handleReject = async () => {
    const reasons = [
      ...selectedReasons,
      extraReason ? "Other: " + extraReason : "",
    ].filter(Boolean);
    console.log("Reject", user, reasons);

    const message =
      reasons.length > 1
        ? `${reasons.slice(0, -1).join(", ")} and ${reasons.slice(-1)}`
        : reasons.join("");

    const res = await verifyUser(false, userId, message);
    console.log(res);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="secondary" fontWeight={600}>
            Reject letter
          </Typography>
          <IconButton aria-label="close-button" onClick={onClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {/* Checkboxes Grid */}
        <Grid container spacing={1}>
          {reasonsList.map((reason, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              aria-label={`Reason ${index + 1}`}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleToggleReason(reason)}
                    color="secondary"
                  />
                }
                label={<Typography fontSize={14}>{reason}</Typography>}
              />
            </Grid>
          ))}
        </Grid>

        {/* Extra Reason Input */}
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder={`Give an extra reason for ${name} :(`}
          variant="outlined"
          value={extraReason}
          onChange={(e) => setExtraReason(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              borderColor: "secondary.main",
            },
          }}
        />

        {/* Reject Button */}
        <Stack mt={2} alignItems="center">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReject}
            endIcon={<CloseIcon />}
          >
            Reject
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationRejectDialog;
