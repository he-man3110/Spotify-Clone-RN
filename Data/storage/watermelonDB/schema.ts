import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "key_value_pairs",
      columns: [
        { name: "key", type: "string", isIndexed: true, isOptional: false },
        { name: "value", type: "string", isOptional: false },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
