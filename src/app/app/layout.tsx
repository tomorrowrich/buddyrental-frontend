import { Box, useMediaQuery } from "@mui/material";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";
import { MobileNavigationBar } from "@/widgets/NavigationBar/MobileNavigationBar";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //adjust for mobile layout
  const isMobile = useMediaQuery("max-width:600px"); //equal to sm breakpoint
  return (
    <>
      {isMobile ? (
        <MobileNavigationBar isAdmin={true} />
      ) : (
        <NavigationBar isAdmin={true} />
      )}
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
