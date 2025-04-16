"use client";
import { createTheme } from "@mui/material/styles";

let BuddyRentalTheme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    fontSize: 12,
    fontFamily: "Poppins, sans-serif",
    allVariants: {
      color: "#7C606B",
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
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
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#7C606B",
      secondary: "#8A7883",
    },
    error: {
      main: "#F44336",
    },
  },
  shadows: [
    "none",
    "0 2px 4px rgba(124, 96, 107, 0.05)",
    "0 4px 8px rgba(124, 96, 107, 0.1)",
    "0 6px 16px rgba(124, 96, 107, 0.15)",
    "0 8px 20px rgba(124, 96, 107, 0.2)",
    ...Array(20).fill(""),
  ],
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedSecondary: {
          boxShadow: "0 3px 8px rgba(196, 107, 174, 0.2)",
        },
        containedTertiary: {
          color: "white",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(124, 96, 107, 0.1)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: "#EB7BC0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "16px 0",
        },
      },
    },
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

declare module "@mui/material/Rating" {
  interface RatingPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/Avatar" {
  interface AvatarPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

declare module "@mui/material/FormControl" {
  interface FormControlPropsColorOverrides {
    tertiary: true;
    quaternary: true;
    quinary: true;
  }
}

export default BuddyRentalTheme;
