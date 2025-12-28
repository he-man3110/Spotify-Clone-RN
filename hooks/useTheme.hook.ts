import { ThemeContext } from "@context/ThemeProvider";
import { useContext } from "react";

export function useTheme() {
  const { theme } = useContext(ThemeContext);
  return { theme };
}
