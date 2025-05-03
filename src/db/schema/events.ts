import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./user";

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  info: varchar("info", { length: 255 }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key
  mitigration: varchar("mitigration", { length: 255 }),
  threat_level_id: integer("threat_level_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});