import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";
import { relations } from "drizzle-orm";

export const object_blocklist_ip = pgTable("object_blocklist_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  attack_times: integer("attack_times"),
  reported: integer("reported"),
});

export const blocklist_ipRelations = relations(object_blocklist_ip, ({ one }) => ({
    object: one(objects, {
        fields: [object_blocklist_ip.id],
        references: [objects.id],
    }),
}));