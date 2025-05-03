import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_virustotal_ip = pgTable("object_virustotal_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  malicious_score: integer("malicious_score"),
  suspicious_score: integer("suspicious_score"),
  undetected_score: integer("undetected_score"),
  harmless_score: integer("harmless_score"),
  reputation: varchar("reputation", { length: 255 }),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const virustotal_ipRelations = relations(object_virustotal_ip, ({ one }) => ({
    object: one(objects, {
        fields: [object_virustotal_ip.id],
        references: [objects.id],
    }),
}));