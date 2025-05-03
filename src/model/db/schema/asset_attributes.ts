import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { events } from "./events";
import { relations } from "drizzle-orm";
import { cve_data } from "./cve_data";

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

export const asset_attributesRelations = relations(asset_attributes, ({ one }) => ({
    event: one(events, {
        fields: [asset_attributes.event_id],
        references: [events.id],
    }),
    cve_data: one(cve_data, {
        fields: [asset_attributes.id],
        references: [cve_data.asset_id],
    }),
}));