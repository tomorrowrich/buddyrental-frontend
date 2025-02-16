import { Box } from "@mui/material";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationBar />
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
