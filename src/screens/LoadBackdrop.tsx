import { Backdrop, CircularProgress } from "@mui/material";

interface LoadBackdropProps {
  open: boolean;
}

export const LoadBackdrop = ({ open }: LoadBackdropProps) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
