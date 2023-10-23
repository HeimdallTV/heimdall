'use client';
import { createGlobalStyle } from 'styled-components';

import { colors } from '@/constants';

export const GlobalStyles = createGlobalStyle`
:root {
  --bg-200: ${colors.bg[200]};
  --bg-300: ${colors.bg[300]};
  --bg-400: ${colors.bg[400]};
  --bg-500: ${colors.bg[500]};
  --bg-600: ${colors.bg[600]};
  --bg-700: ${colors.bg[700]};
  --bg-800: ${colors.bg[800]};
  --bg-900: ${colors.bg[900]};
  --bg-primary: ${colors.bg.primary};
  --bg-contrast: ${colors.bg.contrast};
  --bg-separator: ${colors.bg.separator};

  --text-primary: ${colors.text.primary};
  --text-secondary: ${colors.text.secondary};
  --text-tertiary: ${colors.text.tertiary};
  --text-quaternary: ${colors.text.quaternary};
  --text-accent: ${colors.text.accent};
  --text-on-bg-primary: ${colors.text.onBg.primary};
  --text-on-bg-contrast: ${colors.text.onBg.contrast};

  --red: ${colors.red};
  --green: ${colors.green};
  --yellow: ${colors.yellow};
  --blue: ${colors.blue};
  --purple: ${colors.purple};
  --cyan: ${colors.cyan};
}

html {
  font-size: 10px;
}

body {
  margin: 0;

  background-color: ${colors.bg[500]};
  color: ${colors.text.primary};

  font-size: 1.4rem;

  overflow-x: hidden;
}

body,
input,
button {
  font-family: 'Roboto', serif;
}

a {
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`

