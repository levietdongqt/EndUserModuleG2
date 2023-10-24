import { useMemo } from 'react';
// @mui
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import typography from './typography';
import componentsOverride from './overrides';

// ----------------------------------------------------------------------



export default function ThemeProvider({ children }) {
  const themeOptions = useMemo(
    () => ({
      typography,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      {children}
    </MUIThemeProvider>
  );
}
