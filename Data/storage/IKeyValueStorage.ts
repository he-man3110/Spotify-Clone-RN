/**
 * Interface for key-value storage operations
 * All operations are async by default for better performance
 */
export interface IKeyValueStorage {
  /**
   * Store a value with the given key
   * @param key - The key to store the value under
   * @param value - The value to store (will be JSON stringified)
   * @returns Promise that resolves when the value is stored
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Retrieve a value by key
   * @param key - The key to retrieve the value for
   * @returns Promise that resolves to the value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Check if a key exists in storage
   * @param key - The key to check
   * @returns Promise that resolves to true if key exists, false otherwise
   */
  has(key: string): Promise<boolean>;

  /**
   * Remove a value by key
   * @param key - The key to remove
   * @returns Promise that resolves when the key is removed
   */
  remove(key: string): Promise<void>;

  /**
   * Clear all stored values
   * @returns Promise that resolves when all data is cleared
   */
  clear(): Promise<void>;

  /**
   * Get all keys currently stored
   * @returns Promise that resolves to an array of all keys
   */
  keys(): Promise<string[]>;

  /**
   * Get the number of items stored
   * @returns Promise that resolves to the count of stored items
   */
  size(): Promise<number>;

  /**
   * Get multiple values at once
   * @param keys - Array of keys to retrieve
   * @returns Promise that resolves to an object with key-value pairs
   */
  getMultiple<T>(keys: string[]): Promise<Record<string, T | null>>;

  /**
   * Set multiple key-value pairs at once
   * @param items - Object with key-value pairs to store
   * @returns Promise that resolves when all items are stored
   */
  setMultiple<T>(items: Record<string, T>): Promise<void>;

  /**
   * Remove multiple keys at once
   * @param keys - Array of keys to remove
   * @returns Promise that resolves when all keys are removed
   */
  removeMultiple(keys: string[]): Promise<void>;
}
