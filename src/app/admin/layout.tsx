import { Box } from "@mui/material";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MobileNavigationBar } from "@/widgets/NavigationBar/MobileNavigationBar";

export default function BuddyRentalAdminRootLayout({
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
          backgroundColor: "#EED5C2",
        }}
      >
        {children}
      </Box>
    </>
  );
}
