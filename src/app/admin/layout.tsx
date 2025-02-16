import { Box } from "@mui/material";
import { NavigationBar } from "@/widgets/NavigationBar/NavigationBar";

export default function BuddyRentalAdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationBar isAdmin={true} />
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
