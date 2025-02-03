import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { events } from "./events";


export const objects = pgTable("objects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  object_name: varchar("object_name", { length: 255 }),
  descripton: varchar("descripton", { length: 255 }),
});