import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
  } from 'react';
  import { Appearance } from 'react-native';
  
  type ThemeMode = 'light' | 'dark';
  
  interface ThemeContextValue {
    theme: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
  }
  
  const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
  
  export function ThemeProvider({ children }: { children: ReactNode }) {

    const systemScheme = Appearance.getColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>(
      systemScheme === 'dark' ? 'dark' : 'light'
    );
  
    const setTheme = (mode: ThemeMode) => {
      setThemeState(mode);
    };
  
    const toggleTheme = () => {
      setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };
  
    return (
      <ThemeContext.Provider
        value={{
          theme,
          isDark: theme === 'dark',
          toggleTheme,
          setTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
  
  export function useThemeMode() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
      throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return ctx;
  }
  