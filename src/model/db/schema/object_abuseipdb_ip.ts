import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_abuseipdb_ip = pgTable("object_abuseipdb_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  ip_version: varchar("ip_version", { length: 255 }),
  confidence_score: integer("confidence_score"),
  usage_type: varchar("usage_type", { length: 255 }),
  domain: varchar("domain", { length: 255 }),
  total_reports: integer("total_reports"),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const abuseipdb_ipRelations = relations(object_abuseipdb_ip, ({ one }) => ({
    object: one(objects, {
        fields: [object_abuseipdb_ip.id],
        references: [objects.id],
    }),
}));