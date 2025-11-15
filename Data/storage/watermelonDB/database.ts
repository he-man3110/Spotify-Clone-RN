import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import KeyValueModel from "./models/KeyValueModel";
import { schema } from "./schema";

// Define the models
const models = [KeyValueModel];

// Create the adapter
const adapter = new SQLiteAdapter({
  schema,
  dbName: "spot_clone_db",
  jsi: true, // Enable JSI for better performance (iOS/Android only)
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
  },
});

// Create the database
export const database = new Database({
  adapter,
  modelClasses: models,
});

export default database;
