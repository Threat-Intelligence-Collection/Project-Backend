import { pgTable, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { events } from "./events";

export const attributeTypeEnum = pgEnum("attribute_types", ["ip", "domain"]);

export const attributes = pgTable("attributes", {
  id: integer("id").generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  type: attributeTypeEnum("type").notNull(), 
  value: varchar("value", { length: 255 }).notNull().primaryKey(), 
  firstseen: timestamp("firstseen", { withTimezone: true }), 
  lastseen: timestamp("lastseen", { withTimezone: true }),
});