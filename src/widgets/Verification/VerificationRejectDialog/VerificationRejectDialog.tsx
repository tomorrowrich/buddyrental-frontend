import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  name,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [extraReason, setExtraReason] = useState("");

  const handleToggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
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
          <IconButton onClick={onClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {/* Checkboxes Grid */}
        <Grid container spacing={1}>
          {reasonsList.map((reason, index) => (
            <Grid item xs={12} sm={6} key={index}>
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
            onClick={onClose}
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
