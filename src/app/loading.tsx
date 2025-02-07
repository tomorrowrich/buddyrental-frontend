import { Backdrop, CircularProgress } from "@mui/material";

export function BuddyRentalLoader() {
  return (
    <Backdrop open={true} sx={{ color: "#fff" }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BuddyRentalLoader;
