import { pgTable, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_criminals_ip = pgTable("object_criminals_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  inbound_score: varchar("inbound_score", { length: 255 }),
  ontbound_score: varchar("ontbound_score", { length: 255 }),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const criminals_ipRelations = relations(object_criminals_ip, ({ one }) => ({
    object: one(objects, {
        fields: [object_criminals_ip.id],
        references: [objects.id],
    }),
}));