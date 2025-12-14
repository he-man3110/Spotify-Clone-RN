/**
 * High-performance logging utility with colored output and lazy evaluation
 */

export enum LogLevel {
  VERBOSE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5,
}

interface LogColors {
  reset: string;
  verbose: string;
  debug: string;
  info: string;
  warn: string;
  error: string;
  tag: string;
  timestamp: string;
}

class Logger {
  private currentLevel: LogLevel = __DEV__ ? LogLevel.VERBOSE : LogLevel.INFO;

  private colors: LogColors = {
    reset: "\x1b[0m",
    verbose: "\x1b[37m", // White
    debug: "\x1b[36m", // Cyan
    info: "\x1b[37m", // White
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    tag: "\x1b[35m", // Magenta
    timestamp: "\x1b[90m", // Gray
  };

  private formatTimestamp(): string {
    return new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  }

  private formatMessage(
    level: keyof LogColors,
    tag: string,
    message: string | (() => string)
  ): string {
    // Lazy evaluation: only compute message if needed
    const actualMessage = typeof message === "function" ? message() : message;

    const timestamp = this.formatTimestamp();
    const levelStr = level.toUpperCase().padEnd(7);

    return (
      `${this.colors.timestamp}${timestamp}${this.colors.reset} ` +
      `${this.colors[level]}${levelStr}${this.colors.reset} ` +
      `${this.colors.tag}[${tag}]${this.colors.reset} ` +
      `${this.colors[level]}${actualMessage}${this.colors.reset}`
    );
  }

  private log(
    level: LogLevel,
    colorKey: keyof LogColors,
    tag: string,
    message: string | (() => string)
  ): void {
    // Early return if log level is not active (most efficient check)
    if (level < this.currentLevel) return;

    // Only format and output if level is active
    console.log(this.formatMessage(colorKey, tag, message));
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.currentLevel;
  }

  /**
   * Check if a log level is active
   */
  isLevelActive(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  /**
   * Verbose logging - most detailed
   */
  v(tag: string, message: string | (() => string)): void {
    this.log(LogLevel.VERBOSE, "verbose", tag, message);
  }

  /**
   * Debug logging - development info
   */
  d(tag: string, message: string | (() => string)): void {
    this.log(LogLevel.DEBUG, "debug", tag, message);
  }

  /**
   * Info logging - general information
   */
  i(tag: string, message: string | (() => string)): void {
    this.log(LogLevel.INFO, "info", tag, message);
  }

  /**
   * Warning logging - potential issues
   */
  w(tag: string, message: string | (() => string)): void {
    this.log(LogLevel.WARN, "warn", tag, message);
  }

  /**
   * Error logging - serious problems
   */
  e(tag: string, message: string | (() => string)): void {
    this.log(LogLevel.ERROR, "error", tag, message);
  }

  /**
   * Create a tagged logger for consistent tagging
   */
  createTaggedLogger(defaultTag: string) {
    return {
      v: (message: string | (() => string)) => this.v(defaultTag, message),
      d: (message: string | (() => string)) => this.d(defaultTag, message),
      i: (message: string | (() => string)) => this.i(defaultTag, message),
      w: (message: string | (() => string)) => this.w(defaultTag, message),
      e: (message: string | (() => string)) => this.e(defaultTag, message),
    };
  }

  /**
   * Performance timing utility
   */
  time(tag: string, label: string): () => void {
    if (!this.isLevelActive(LogLevel.DEBUG)) {
      return () => {}; // Return no-op if debug not active
    }

    const start = performance.now();
    this.d(tag, `⏱️  Starting: ${label}`);

    return () => {
      const duration = performance.now() - start;
      this.d(tag, `⏱️  Finished: ${label} (${duration.toFixed(2)}ms)`);
    };
  }

  /**
   * Group logging (for related messages)
   */
  group(tag: string, title: string, collapsed = false): () => void {
    if (!this.isLevelActive(LogLevel.DEBUG)) {
      return () => {}; // Return no-op if debug not active
    }

    if (collapsed) {
      console.groupCollapsed(
        `${this.colors.tag}[${tag}] ${title}${this.colors.reset}`
      );
    } else {
      console.group(`${this.colors.tag}[${tag}] ${title}${this.colors.reset}`);
    }

    return () => console.groupEnd();
  }
}

// Create singleton instance
const Log = new Logger();

// Export singleton and types
export { Log, Logger };
export default Log;

// Example usage:
/*
import Log, { LogLevel } from '@utils/log/Log';

// Set log level
Log.setLevel(LogLevel.INFO);

// Basic logging
Log.info('AUTH', 'User logged in successfully');
Log.error('API', 'Failed to fetch user data');

// Lazy evaluation (expensive operation only runs if level is active)
Log.debug('PERF', () => `Heavy computation result: ${expensiveCalculation()}`);

// Tagged logger for consistent tagging
const authLogger = Log.createTaggedLogger('AUTH');
authLogger.info('Token refreshed');

// Performance timing
const endTimer = Log.time('API', 'Fetch user profile');
// ... do work ...
endTimer();

// Group related logs
const endGroup = Log.group('STARTUP', 'App Initialization');
Log.info('STARTUP', 'Loading fonts...');
Log.info('STARTUP', 'Initializing SDK...');
endGroup();
*/
