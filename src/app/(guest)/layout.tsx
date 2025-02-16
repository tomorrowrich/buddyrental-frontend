import { ReducedNavBar } from "@/widgets/NavigationBar/ReducedNavBar";
import { Box } from "@mui/material";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ReducedNavBar />
      <Box
        flex={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        {children}
      </Box>
    </>
  );
}
