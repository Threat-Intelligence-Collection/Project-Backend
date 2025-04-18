import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { events } from "./events";

export const userTypeEnum = pgEnum("user_type", ["admin", "user", "guest"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_name: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  user_role: userTypeEnum("user_role").notNull().default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  events: many(events),
}));
