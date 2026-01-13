import React, { createContext, PropsWithChildren, useState } from "react";
import theme from "../theme/Default.theme";
import { Theme } from "../theme/Theme.interface";

export type ThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const defaultThemeContext: ThemeContext = {
  theme: theme,
  setTheme: () => {
    console.error("Cannot use setTheme outside a ThemeProvider!");
  },
};

export const ThemeContext = createContext<ThemeContext>(defaultThemeContext);

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const [appTheme, setAppTheme] = useState(theme);
  // TODO: Add support to switch themes.
  //   const colorScheme = useColorScheme();

  return (
    <ThemeContext.Provider
      value={{
        theme: appTheme,
        setTheme: setAppTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
