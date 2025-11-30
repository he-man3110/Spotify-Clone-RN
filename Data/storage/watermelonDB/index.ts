export { IKeyValueStorage } from "../IKeyValueStorage";
export { database } from "./database";
export { default as KeyValueModel } from "./models/KeyValueModel";
export { schema } from "./schema";
export { WatermelonKeyValueStorage } from "./WatermelonKeyValueStorage";

import { database } from "./database";
import { WatermelonKeyValueStorage } from "./WatermelonKeyValueStorage";

// Create a singleton instance of the storage
export const keyValueStorage = new WatermelonKeyValueStorage(database);

// Export as default for convenience
export default keyValueStorage;
