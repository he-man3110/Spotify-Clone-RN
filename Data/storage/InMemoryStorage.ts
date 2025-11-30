import { IKeyValueStorage } from "./IKeyValueStorage";

/**
 * In-memory implementation of IKeyValueStorage
 * This is a fallback for environments where WatermelonDB doesn't work (like web)
 */
export class InMemoryStorage implements IKeyValueStorage {
  private storage = new Map<string, string>();

  async set<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = this.storage.get(key);
      if (value === undefined) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Error getting value from in-memory storage:", error);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    return this.storage.has(key);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async size(): Promise<number> {
    return this.storage.size;
  }

  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }
    
    return result;
  }

  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    for (const [key, value] of Object.entries(items)) {
      await this.set(key, value);
    }
  }

  async removeMultiple(keys: string[]): Promise<void> {
    for (const key of keys) {
      this.storage.delete(key);
    }
  }
}