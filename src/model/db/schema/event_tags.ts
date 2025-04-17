import { pgTable, integer } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { events } from "./events";
import { relations } from "drizzle-orm";

export const event_tags = pgTable("event_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tag_id: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }), // Foreign key
  event_id: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }), // Foreign key
});

export const event_tagsRelations = relations(event_tags, ({ one }) => ({
    event: one(events, {
        fields: [event_tags.event_id],
        references: [events.id],
    }),
    tag: one(tags, {
        fields: [event_tags.tag_id],
        references: [tags.id],
    }),
}));