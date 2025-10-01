'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
  id: string;
  siteId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  spacing: string;
}

interface ThemeContextType {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  setTheme: () => {},
  applyTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  const applyTheme = () => {
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--background', theme.backgroundColor);
    root.style.setProperty('--foreground', theme.textColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--heading-font', theme.headingFont);
    root.style.setProperty('--radius', theme.borderRadius);
  };

  useEffect(() => {
    applyTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

