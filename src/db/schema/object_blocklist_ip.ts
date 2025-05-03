import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_blocklist_ip = pgTable("object_blocklist_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  attack_times: integer("attack_times"),
  reported: integer("reported"),
});