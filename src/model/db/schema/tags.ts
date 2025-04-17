import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { event_tags } from "./event_tags";
import { relations } from "drizzle-orm";

export const tags = pgTable("tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tag_name: varchar("tag_name", { length: 255 }).notNull().unique(), // Renamed for consistency
  color: varchar("color", { length: 7 }).notNull().default("#000000"), // Default color
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  event_tags: many(event_tags),
}));

