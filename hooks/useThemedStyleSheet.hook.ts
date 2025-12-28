import { useMemo } from "react";
import { Theme } from "../theme/Theme.interface";
import { useTheme } from "./useTheme.hook";

export function useThemedStyleSheet<Args extends Array<unknown>, R>(
  styleCreator: (theme: Theme, ...args: Args) => R,
  ...args: Args
) {
  const { theme } = useTheme();

  const styles = useMemo(() => styleCreator(theme, ...args), [theme, ...args]);

  return {
    styles,
    theme,
  };
}
