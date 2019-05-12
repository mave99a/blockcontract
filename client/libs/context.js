import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

export const colors = {
  white: '#ffffff',
  dark: '#4A707C',
  gray: '#222222',
  minor: '#9b9b9b',
  darkText: '#dcdcdc',
  background: '#f7f8f8',
  yellow: '#FFCF71',
  green: '#4cbbb9',
  red: '#FF7B8A',
  blue: '#4e6af6',
};

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  pageWidth: 1000,
  palette: {
    primary: { main: colors.green, contrastText: colors.white },
    secondary: { main: colors.red, contrastText: colors.white },
  },
  typography: {
    fontSize: 14,
    useNextVariants: true,
  },
  overrides: {
    MuiButtonBase: {
      root: {
        boxShadow: 'none !important',
      },
    },
    MuiButton: {
      root: {
        letterSpacing: '1.5px',
        boxShadow: 'none !important',
      },
    },
  },
  colors,
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}
