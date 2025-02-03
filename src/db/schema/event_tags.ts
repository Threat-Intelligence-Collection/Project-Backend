import { pgTable, integer } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { events } from "./events";

export const event_tags = pgTable("event_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tag_id: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }), // Foreign key
  event_id: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }), // Foreign key
});