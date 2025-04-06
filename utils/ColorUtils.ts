export type HexColorValue = `#${string}`;

export namespace ColorUtils {
  /**
   * Adds or updates the alpha value of a hex color
   * @param hexColor - Hex color code (3, 6, or 8 characters e.g. #abc, #aabbcc, #aabbccdd)
   * @param opacity - Opacity between 0 to 1
   * @returns Hex color with updated alpha value
   */
  export function withAlpha(
    hexColor: HexColorValue,
    opacity: number
  ): HexColorValue {
    if (!/^#([0-9a-f]{3,8})$/i.test(hexColor)) {
      throw new Error("Invalid hex color");
    }

    // Normalize to full 6-digit hex if shorthand (#abc → #aabbcc)
    let hex = hexColor.slice(1);
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
}
