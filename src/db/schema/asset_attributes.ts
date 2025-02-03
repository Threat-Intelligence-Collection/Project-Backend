import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { events } from "./events";

export const asset_attributes = pgTable("asset_attributes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  asset_name: varchar("asset_name", { length: 255 }),
  version: varchar("version", { length: 255 }),
  vendor: varchar("vendor", { length: 255 }),
  cpe: varchar("cpe", { length: 255 }),
  source: varchar("source", { length: 255 }),
  exp: timestamp("exp", { withTimezone: true }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});