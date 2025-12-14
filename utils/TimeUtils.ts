/**
 * Time formatting utilities for music player
 */

/**
 * Converts milliseconds to MM:SS format
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "3:45", "12:34")
 */
export const formatTime = (ms: number | null | undefined): string => {
  if (!ms || ms < 0) return "0:00";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Converts milliseconds to HH:MM:SS format for longer durations
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "1:23:45")
 */
export const formatLongTime = (ms: number | null | undefined): string => {
  if (!ms || ms < 0) return "0:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Converts MM:SS format back to milliseconds
 * @param timeString - Time string in MM:SS format
 * @returns Time in milliseconds
 */
export const parseTimeToMs = (timeString: string): number => {
  const parts = timeString.split(":").map(Number);

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes * 60 + seconds) * 1000;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  return 0;
};

/**
 * Formats time with relative descriptions for very short/long durations
 * @param ms - Time in milliseconds
 * @returns Formatted time with context
 */
export const formatTimeWithContext = (
  ms: number | null | undefined
): string => {
  if (!ms || ms < 0) return "0:00";

  const seconds = Math.floor(ms / 1000);

  if (seconds < 1) return "< 1 sec";
  if (seconds < 60) return `${seconds} sec`;

  return formatTime(ms);
};

/**
 * Calculates remaining time
 * @param totalMs - Total duration in milliseconds
 * @param currentMs - Current progress in milliseconds
 * @returns Remaining time formatted as string
 */
export const formatRemainingTime = (
  totalMs: number | null | undefined,
  currentMs: number | null | undefined
): string => {
  if (!totalMs || !currentMs) return "0:00";

  const remaining = Math.max(0, totalMs - currentMs);
  return `-${formatTime(remaining)}`;
};

/**
 * Formats progress as percentage
 * @param currentMs - Current progress in milliseconds
 * @param totalMs - Total duration in milliseconds
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  currentMs: number | null | undefined,
  totalMs: number | null | undefined
): number => {
  if (!currentMs || !totalMs || totalMs === 0) return 0;

  return Math.min(100, Math.max(0, (currentMs / totalMs) * 100));
};

// Export all utilities as default object
export default {
  formatTime,
  formatLongTime,
  parseTimeToMs,
  formatTimeWithContext,
  formatRemainingTime,
  calculateProgress,
};
