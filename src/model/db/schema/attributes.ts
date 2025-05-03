import { pgTable, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { events } from "./events";
import { relations } from "drizzle-orm";
import { locations } from "./locations";

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

export const attributesRelations = relations(attributes, ({ one }) => ({
    event: one(events, {
        fields: [attributes.event_id],
        references: [events.id],
    }),
    location: one(locations, {
        fields: [attributes.value],
        references: [locations.att_value],
    }),
}));