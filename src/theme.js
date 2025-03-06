// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: "#1A2238",  // set the default background to navy
    },
  },
  typography: {
    fontFamily: 'Ubuntu, sans-serif',
  },
});

export default theme;
