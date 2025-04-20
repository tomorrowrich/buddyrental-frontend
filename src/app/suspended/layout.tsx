import { Box } from "@mui/material";
import NavigationSwitcher from "@/widgets/NavigationBar/NavigationSwitcher";

export default function BuddyRentalRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationSwitcher />
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
