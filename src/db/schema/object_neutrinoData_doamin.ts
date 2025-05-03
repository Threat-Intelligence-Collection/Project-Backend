import { pgTable, text, integer, varchar,boolean } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_neutrinoData_domain = pgTable("object_neutrinoData_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  blocklist: text("blocklist").array(),
  is_malicious: boolean("is_malicious"),
  description: varchar("description", { length: 255 })
});