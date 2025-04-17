import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { asset_attributes } from "./asset_attributes";
import { relations } from "drizzle-orm";

export const cve_data = pgTable("cve_data", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  asset_id: integer("asset_id")
    .notNull()
    .references(() => asset_attributes.id, { onDelete: "cascade" }),
  cve_id: varchar("cve_id", { length: 255 }),
  description: varchar("description", { length: 255 }),
  cvss_score: varchar("cvss_score", { length: 255 }),
  severity: varchar("severity", { length: 255 }),
  published: timestamp("published", { withTimezone: true }),
  last_modified: timestamp("last_modified", { withTimezone: true }),
});

export const cve_dataRelations = relations(cve_data, ({ one }) => ({
    asset_attributes: one(asset_attributes, {
        fields: [cve_data.asset_id],
        references: [asset_attributes.id],
    }),
}));