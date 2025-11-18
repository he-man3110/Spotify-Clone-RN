import { Log as LogUtil } from "@utils/log/Log";
import { IKeyValueStorage } from "./IKeyValueStorage";
import keyValueStorage from "./watermelonDB";

/**
 * Cache configuration options
 */
export interface CacheConfig {
  defaultTTL?: number; // Time to live in milliseconds
  keyPrefix?: string; // Prefix for all cache keys
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  value: T;
  expiresAt: number; // Timestamp in milliseconds when entry expires (0 means never expires)
}

const Log = LogUtil.createTaggedLogger('[SDKCacheManager]');

/**
 * SDK Cache Manager - High-level abstraction for caching operations
 * Provides TTL support, namespacing, and convenient methods for common use cases
 */
export class SDKCacheManager {
  private storage: IKeyValueStorage;
  private config: Required<CacheConfig>;

  constructor(storage: IKeyValueStorage, config: CacheConfig = {}) {
    this.storage = storage;
    this.config = {
      defaultTTL: config.defaultTTL || 0, // 0 means no expiration
      keyPrefix: config.keyPrefix || "sdk_cache:",
    };
  }

  /**
   * Generate a cache key with prefix
   */
  private getCacheKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  /**
   * Check if a cache entry is expired
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    if (entry.expiresAt === 0) return false; // Never expires
    return Date.now() > entry.expiresAt;
  }

  /**
   * Calculate expiry time based on TTL
   */
  private calculateExpiresAt(ttl?: number): number {
    const effectiveTTL = ttl !== undefined ? ttl : this.config.defaultTTL;
    if (effectiveTTL === 0) return 0; // Never expires
    return Date.now() + effectiveTTL;
  }

  /**
   * Store a value in cache with optional TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    Log.d(`set: k:${cacheKey}, v:${value}`);
    await this.storage.set(cacheKey, value);
  }

  /**
   * Get a value from cache, returns undefined if expired or not found
   */
  async get<T>(key: string): Promise<T | undefined> {
    const cacheKey = this.getCacheKey(key);
    const entry = await this.storage.get<CacheEntry<T>>(cacheKey);

    if (!entry) {
      Log.d(`get: k:${cacheKey}, v:undefined`);
      return undefined;
    }


    if (this.isExpired(entry)) {
      // Clean up expired entry
      await this.storage.remove(cacheKey);
      Log.d(`get: k:${cacheKey}, v:${entry} - Expired`);
      return undefined;
    }

    Log.d(`get: k:${cacheKey}, v:${entry}`);
    return entry.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(key);
    const value = await this.get(cacheKey);
    const result =  value !== undefined && value !== null;
    Log.d(`has: k:${cacheKey} - ${result}`);
    return result;
  }

  /**
   * Remove a specific key from cache
   */
  async remove(key: string): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    Log.d(`remove: k:${cacheKey}`);
    await this.storage.remove(cacheKey);
  }

  /**
   * Clear all cache entries with the current prefix
   */
  async clear(): Promise<void> {
    const allKeys = await this.storage.keys();
    const cacheKeys = allKeys.filter((key) =>
      key.startsWith(this.config.keyPrefix)
    );

    if (cacheKeys.length > 0) {
      Log.d(`clear all`);
      await this.storage.removeMultiple(cacheKeys);
    }
  }

  /**
   * Clean up expired entries
   */
  async cleanup(): Promise<void> {
    const allKeys = await this.storage.keys();
    const cacheKeys = allKeys.filter((key) =>
      key.startsWith(this.config.keyPrefix)
    );

    const expiredKeys: string[] = [];

    for (const cacheKey of cacheKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry && this.isExpired(entry)) {
        expiredKeys.push(cacheKey);
      }
    }

    if (expiredKeys.length > 0) {
      await this.storage.removeMultiple(expiredKeys);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalEntries: number;
    expiredEntries: number;
    sizeBytes: number;
  }> {
    const allKeys = await this.storage.keys();
    const cacheKeys = allKeys.filter((key) =>
      key.startsWith(this.config.keyPrefix)
    );

    let expiredCount = 0;
    let totalSize = 0;

    for (const cacheKey of cacheKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry) {
        if (this.isExpired(entry)) {
          expiredCount++;
        }
        // Rough estimate of size in bytes
        totalSize += JSON.stringify(entry).length * 2; // UTF-16 encoding
      }
    }

    return {
      totalEntries: cacheKeys.length,
      expiredEntries: expiredCount,
      sizeBytes: totalSize,
    };
  }

  /**
   * Get all valid (non-expired) cache keys
   */
  async getValidKeys(): Promise<string[]> {
    const allKeys = await this.storage.keys();
    const cacheKeys = allKeys.filter((key) =>
      key.startsWith(this.config.keyPrefix)
    );
    const validKeys: string[] = [];

    for (const cacheKey of cacheKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry && !this.isExpired(entry)) {
        // Remove prefix to get original key
        validKeys.push(cacheKey.replace(this.config.keyPrefix, ""));
      }
    }

    return validKeys;
  }

  /**
   * Batch get multiple keys
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | undefined>> {
    const cacheKeys = keys.map((key) => this.getCacheKey(key));
    const entries = await this.storage.getMultiple<CacheEntry<T>>(cacheKeys);

    const result: Record<string, T | undefined> = {};
    const expiredKeys: string[] = [];

    for (let i = 0; i < keys.length; i++) {
      const originalKey = keys[i];
      const cacheKey = cacheKeys[i];
      const entry = entries[cacheKey];

      if (!entry) {
        result[originalKey] = undefined;
        continue;
      }

      if (this.isExpired(entry)) {
        result[originalKey] = undefined;
        expiredKeys.push(cacheKey);
      } else {
        result[originalKey] = entry.value;
      }
    }

    // Clean up expired entries
    if (expiredKeys.length > 0) {
      await this.storage.removeMultiple(expiredKeys);
    }

    return result;
  }

  /**
   * Batch set multiple keys
   */
  async setMultiple<T>(items: Record<string, T>, ttl?: number): Promise<void> {
    const cacheEntries: Record<string, CacheEntry<T>> = {};
    const expiresAt = this.calculateExpiresAt(ttl);

    Object.entries(items).forEach(([key, value]) => {
      const cacheKey = this.getCacheKey(key);
      cacheEntries[cacheKey] = {
        value,
        expiresAt,
      };
    });

    await this.storage.setMultiple(cacheEntries);
  }

  /**
   * Set with condition - only sets if condition returns true
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Configuration options
   */
  async setWithCondition<T>(
    key: string,
    value: T,
    options: {
      ttl?: number;
      /**
       * Condition function that determines whether to set the value
       * @param currentValue - Currently cached value (null if not found or expired)
       * @param newValue - New value to be cached
       * @param cacheMetadata - Metadata about current cached entry
       * @returns true to set the value, false to skip
       */
      condition: (currentValue: T | undefined, newValue: T) => boolean;
    }
  ): Promise<boolean> {
    const cacheKey = this.getCacheKey(key);
    const entry = await this.storage.get<CacheEntry<T>>(cacheKey);

    let currentValue: T | undefined = undefined;

    if (entry && !this.isExpired(entry)) {
      currentValue = entry.value;
    }

    const shouldSet = options.condition(currentValue, value);

    if (shouldSet) {
      await this.set(key, value, options.ttl);
      return true;
    }

    return false;
  }

  /**
   * Get with refresh condition - allows conditional refresh of cached data
   * @param key - Cache key
   * @param fetchFn - Function to fetch fresh data
   * @param options - Configuration options
   */
  async getWithRefresh<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: {
      ttl?: number;
      /**
       * Determines if cache should be refreshed
       * @param cachedValue - Current cached value
       * @param cacheMetadata - Metadata about the cached entry
       * @returns 'use-cache' | 'refresh' | 'refresh-background'
       */
      refreshCondition: (
        cachedValue: T | null,
        cacheMetadata: {
          exists: boolean;
          isExpired: boolean;
          age?: number; // Time remaining until expiry in milliseconds (undefined if never expires)
          expiresAt?: number; // Timestamp when entry expires (0 if never expires)
        }
      ) => "use-cache" | "refresh" | "refresh-background";
    }
  ): Promise<T | null> {
    const cacheKey = this.getCacheKey(key);
    const entry = await this.storage.get<CacheEntry<T>>(cacheKey);

    let cachedValue: T | null = null;
    let metadata = {
      exists: false,
      isExpired: false,
      age: undefined as number | undefined,
      expiresAt: undefined as number | undefined,
    };

    if (entry) {
      metadata.exists = true;
      metadata.expiresAt = entry.expiresAt;
      metadata.age =
        entry.expiresAt === 0
          ? undefined
          : Math.max(0, entry.expiresAt - Date.now());
      metadata.isExpired = this.isExpired(entry);

      if (!metadata.isExpired) {
        cachedValue = entry.value;
      }
    }

    const refreshAction = options.refreshCondition(cachedValue, metadata);

    switch (refreshAction) {
      case "use-cache":
        return cachedValue;

      case "refresh":
        const value = await fetchFn();
        await this.set(key, value, options.ttl);
        return value;

      case "refresh-background":
        // Return cached value immediately, refresh in background
        if (cachedValue !== null) {
          // Background refresh (fire and forget)
          fetchFn()
            .then((value) => this.set(key, value, options.ttl))
            .catch((error) =>
              console.warn(`Background refresh failed for key ${key}:`, error)
            );

          return cachedValue;
        } else {
          // No cached value, must fetch synchronously
          const value = await fetchFn();
          await this.set(key, value, options.ttl);
          return value;
        }

      default:
        return cachedValue;
    }
  }

  /**
   * Get cache metadata without retrieving the value
   * @param key - Cache key
   * @returns Metadata about the cached entry
   */
  async getCacheMetadata(key: string): Promise<{
    exists: boolean;
    isExpired: boolean;
    age?: number; // Time remaining until expiry in milliseconds (undefined if never expires)
    expiresAt?: number; // Timestamp when entry expires (0 if never expires)
  }> {
    const cacheKey = this.getCacheKey(key);
    const entry = await this.storage.get<CacheEntry<any>>(cacheKey);

    if (!entry) {
      return { exists: false, isExpired: false };
    }

    const age =
      entry.expiresAt === 0
        ? undefined
        : Math.max(0, entry.expiresAt - Date.now());
    const isExpired = this.isExpired(entry);

    return {
      exists: true,
      isExpired,
      age,
      expiresAt: entry.expiresAt,
    };
  }
}

// Create singleton instances for different cache namespaces
export const userCache = new SDKCacheManager(keyValueStorage, {
  keyPrefix: "user:",
  defaultTTL: 30 * 60 * 1000, // 30 minutes
});

export const apiCache = new SDKCacheManager(keyValueStorage, {
  keyPrefix: "api:",
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
});

export const settingsCache = new SDKCacheManager(keyValueStorage, {
  keyPrefix: "settings:",
  defaultTTL: 0, // No expiration
});

export const spotifyCache = new SDKCacheManager(keyValueStorage, {
  keyPrefix: "spotify:",
  defaultTTL: 15 * 60 * 1000, // 15 minutes
});

// Default export
export default new SDKCacheManager(keyValueStorage);
