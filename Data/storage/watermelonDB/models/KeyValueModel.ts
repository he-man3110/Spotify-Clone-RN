import { Model } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";

export default class KeyValueModel extends Model {
  static table = "key_value_pairs";

  @field("key") key!: string;
  @field("value") value!: string;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
