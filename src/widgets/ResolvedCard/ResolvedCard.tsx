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
  useTheme,
  Container,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const ResolvedCard = ({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [action, setAction] = useState<string>("");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip label="Chip Filled" color="primary" />
              <Typography variant="body2" color="text.secondary">
                จ่ายเงินมีปัญหา โปรแกรมไม่ดีเอาตังค์ไม่ยอมคืน
              </Typography>
            </Box>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3 }}
          onClick={() => setOpen(true)}
        >
          Resolve
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#C76CA8", mb: 2 }}
            >
              Resolve Buddy/customer Report
            </Typography>

            <Box sx={{ border: "1px solid #E4A4B7", borderRadius: 2, p: 2 }}>
              <Typography fontWeight="bold" color="#C76CA8">
                Reported Account
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Avatar src={avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">{name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {email}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                แอคเค้าท์คนนี้หลอกลวง ใช้รูปปลอม ไปถึงตัวจริงไม่เห็นตรงปกเลย
                ช่วยเตะออกไปด้วยค่ะ
              </Typography>
            </Box>

            <RadioGroup
              value={action}
              onChange={(e) => setAction(e.target.value)}
              sx={{ mt: 2, display: "flex", flexDirection: "column" }}
            >
              {[
                { value: "10days", label: "Suspend for 10 Days" },
                { value: "1month", label: "Suspend for 1 Month" },
                { value: "3months", label: "Suspend for 3 Months" },
                { value: "ban", label: "Ban the Account" },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        color: "#E4A4B7",
                        "&.Mui-checked": { color: "#E4A4B7" },
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </RadioGroup>

            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#E4A4B7",
                  color: "white",
                  mt: 3,
                  width: "50%",
                  borderRadius: 2,
                }}
              >
                Resolve
              </Button>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};
