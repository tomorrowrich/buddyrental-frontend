import { Backdrop, CircularProgress } from "@mui/material";
import Image from "next/image";

interface LoadBackdropProps {
  open: boolean;
}

export function LoadBackdrop({ open }: LoadBackdropProps) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
      data-testid="backdrop"
    >
      <Image
        src="/logo-full.svg"
        alt="BuddyRental Logo"
        width={200}
        height={40}
      />
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
