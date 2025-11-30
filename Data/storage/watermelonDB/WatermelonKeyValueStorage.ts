import { Database, Q } from "@nozbe/watermelondb";
import { IKeyValueStorage } from "../IKeyValueStorage";
import KeyValueModel from "./models/KeyValueModel";

export class WatermelonKeyValueStorage implements IKeyValueStorage {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const stringValue = JSON.stringify(value);

    await this.database.write(async () => {
      const existingRecord = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query(Q.where("key", key))
        .fetch();

      if (existingRecord.length > 0) {
        // Update existing record
        await existingRecord[0].update((record) => {
          record.value = stringValue;
        });
      } else {
        // Create new record
        await this.database
          .get<KeyValueModel>("key_value_pairs")
          .create((record) => {
            record.key = key;
            record.value = stringValue;
          });
      }
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const records = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query(Q.where("key", key))
        .fetch();

      if (records.length === 0) {
        return null;
      }

      const stringValue = records[0].value;
      return JSON.parse(stringValue) as T;
    } catch (error) {
      console.error("Error getting value from storage:", error);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    const records = await this.database
      .get<KeyValueModel>("key_value_pairs")
      .query(Q.where("key", key))
      .fetch();

    return records.length > 0;
  }

  async remove(key: string): Promise<void> {
    await this.database.write(async () => {
      const records = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query(Q.where("key", key))
        .fetch();

      if (records.length > 0) {
        await records[0].destroyPermanently();
      }
    });
  }

  async clear(): Promise<void> {
    await this.database.write(async () => {
      const allRecords = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query()
        .fetch();

      await Promise.all(
        allRecords.map((record) => record.destroyPermanently())
      );
    });
  }

  async keys(): Promise<string[]> {
    const records = await this.database
      .get<KeyValueModel>("key_value_pairs")
      .query()
      .fetch();

    return records.map((record) => record.key);
  }

  async size(): Promise<number> {
    const count = await this.database
      .get<KeyValueModel>("key_value_pairs")
      .query()
      .fetchCount();

    return count;
  }

  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const records = await this.database
      .get<KeyValueModel>("key_value_pairs")
      .query(Q.where("key", Q.oneOf(keys)))
      .fetch();

    const result: Record<string, T | null> = {};

    // Initialize all keys with null
    keys.forEach((key) => {
      result[key] = null;
    });

    // Fill in the actual values
    records.forEach((record) => {
      try {
        result[record.key] = JSON.parse(record.value) as T;
      } catch (error) {
        console.error(`Error parsing value for key ${record.key}:`, error);
        result[record.key] = null;
      }
    });

    return result;
  }

  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    await this.database.write(async () => {
      const keys = Object.keys(items);

      // Get existing records
      const existingRecords = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query(Q.where("key", Q.oneOf(keys)))
        .fetch();

      // Create a map of existing records by key
      const existingByKey = new Map<string, KeyValueModel>();
      existingRecords.forEach((record) => {
        existingByKey.set(record.key, record);
      });

      // Process each item
      const operations = keys.map(async (key) => {
        const stringValue = JSON.stringify(items[key]);
        const existingRecord = existingByKey.get(key);

        if (existingRecord) {
          // Update existing record
          return existingRecord.update((record) => {
            record.value = stringValue;
          });
        } else {
          // Create new record
          return this.database
            .get<KeyValueModel>("key_value_pairs")
            .create((record) => {
              record.key = key;
              record.value = stringValue;
            });
        }
      });

      await Promise.all(operations);
    });
  }

  async removeMultiple(keys: string[]): Promise<void> {
    await this.database.write(async () => {
      const records = await this.database
        .get<KeyValueModel>("key_value_pairs")
        .query(Q.where("key", Q.oneOf(keys)))
        .fetch();

      await Promise.all(records.map((record) => record.destroyPermanently()));
    });
  }
}
