import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D45529', // SeniorCare theme orange-brown
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4E2818', // Warm brown
    },
    background: {
      default: '#FAF8F6', // Off-white/cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A0E07', // Very dark brown/grey instead of pure black
      secondary: '#6E625B', // Muted brown-grey
    },
    divider: '#EAE5E0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 650,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.925rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.825rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #EAE5E0',
          boxShadow: 'none',
          borderRadius: '12px',
          padding: '20px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#EAE5E0',
          color: '#1A0E07',
          '&:hover': {
            backgroundColor: '#FAF8F6',
            borderColor: '#D45529',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '6px',
        },
      },
    },
  },
});
