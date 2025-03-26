"use client";
import { createTheme } from "@mui/material/styles";

let BuddyRentalTheme = createTheme({
  colorSchemes: {
    light: true,
    dark: false,
  },
  typography: {
    fontSize: 12,
    fontFamily: "Poppins, sans-serif",
    allVariants: {
      color: "#7C606B",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

BuddyRentalTheme = createTheme(BuddyRentalTheme, {
  palette: {
    primary: BuddyRentalTheme.palette.augmentColor({
      color: { main: "#7C606B" },
      name: "primary",
    }),
    secondary: BuddyRentalTheme.palette.augmentColor({
      color: { main: "#C46BAE" },
      name: "secondary",
    }),
    tertiary: BuddyRentalTheme.palette.augmentColor({
      color: { main: "#EB7BC0" },
      name: "tertiary",
    }),
    quaternary: BuddyRentalTheme.palette.augmentColor({
      color: { main: "#EDA4BD" },
      name: "quaternary",
    }),
    quinary: BuddyRentalTheme.palette.augmentColor({
      color: { main: "#EED5C2" },
      name: "quinary",
    }),
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    quaternary: Palette["primary"];
    quinary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    quaternary?: PaletteOptions["primary"];
    quinary?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/InputAdornment" {
  interface InputAdornmentPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/Link" {
  interface LinkPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

export default BuddyRentalTheme;
