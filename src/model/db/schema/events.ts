import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { objects } from "./objects";
import { event_tags } from "./event_tags";
import { attributes } from "./attributes";
import { asset_attributes } from "./asset_attributes";

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  info: varchar("info", { length: 255 }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), 
  mitigration: varchar("mitigration", { length: 255 }),
  threat_level_id: integer("threat_level_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, {
    fields: [events.user_id],
    references: [users.id],
  }),
  objects: many(objects),
  event_tags: many(event_tags),
  attributes: many(attributes),
  asset_attributes: many(asset_attributes),
}));
