import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { objects } from "./objects";

export const object_dbip_ip = pgTable("object_dbip_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  ip_type: varchar("ip_type", { length: 255 }),
  attack_target: varchar("attack_target", { length: 255 }),
  risk_level: varchar("risk_level", { length: 255 }),
});