import { ColorValue } from "react-native";

export type HexColorValue = `#${string}`;

export namespace ColorUtils {
  /**
   * Adds or updates the alpha value of a hex color
   * @param hexColor - Hex color code (3, 6, or 8 characters e.g. #abc, #aabbcc, #aabbccdd)
   * @param opacity - Opacity between 0 to 1
   * @returns Hex color with updated alpha value
   */
  export function withAlpha(
    hexColor: HexColorValue | ColorValue,
    opacity: number
  ): HexColorValue {
    if (!/^#([0-9a-fA-F]{3,8})$/i.test(hexColor.toString())) {
      throw new Error("Invalid hex color : " + hexColor.toString());
    }

    // Normalize to full 6-digit hex if shorthand (#abc → #aabbcc)
    let hex = hexColor.toString().slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    if (hex.length === 6) {
      // Append alpha if missing
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0");
      return `#${hex}${alpha}`;
    }

    if (hex.length === 8) {
      // Replace alpha if already present
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0");
      return `#${hex.slice(0, 6)}${alpha}`;
    }

    throw new Error("Invalid hex color length");
  }

  /**
   * Adjust color brightness and return in hex format
   * @param hexColor - Hex color code
   * @param opacity - Opacity/brightness multiplier between 0 to 1
   * @returns Hex color with adjusted brightness
   */
  export const adjustColorForContrastHex = (
    hexColor: string,
    opacity: number = 0.4
  ): HexColorValue => {
    // Handle rgba/rgb colors - convert to hex first
    if (hexColor.startsWith("rgb")) {
      // For now, return a fallback - could implement rgb to hex conversion
      return "#121212" as HexColorValue;
    }

    // Convert hex to RGB
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;

    // Darken the color for background use
    const darkR = Math.floor(r * opacity);
    const darkG = Math.floor(g * opacity);
    const darkB = Math.floor(b * opacity);

    // Convert back to hex
    const toHex = (value: number) => value.toString(16).padStart(2, "0");

    return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}` as HexColorValue;
  };
}
